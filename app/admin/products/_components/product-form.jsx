"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm, Controller } from "react-hook-form";
import * as yup from "yup";
import { useDropzone } from "react-dropzone";
import slugify from "slugify";
import {
  X,
  Upload,
  Image as ImageIcon,
  Loader2,
  CheckCircle,
  AlertCircle,
  Plus,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";

const formSchema = yup.object().shape({
  name: yup
    .string()
    .min(2, "Product name must be at least 2 characters.")
    .required(),
  slug: yup.string().min(2, "Slug must be at least 2 characters").required(),
  desc: yup.string().min(10, "Desc must be at least 10 characters").required(),
  specifications: yup.array().of(
    yup.object().shape({
      name: yup.string().required("Specification name is required"),
      value: yup.string().required("Specification value is required"),
    })
  ),
  mainImage: yup
    .string()
    .test("is-valid-image", "Main image is required", function (value) {
      // This is a custom context check to access the form state
      const { mainFile, mainPreview } = this.options.context || {};

      // Log what we're checking
      console.log("Validating mainImage:", { value, mainFile, mainPreview });

      // If we have a file or preview, always consider it valid
      if (mainFile || mainPreview) {
        return true;
      }

      // Accept both a valid URL, our temporary marker, or ANY non-empty value for now
      // for easier debugging
      return (
        value === "pending-upload" ||
        value === "forced-valid-value" ||
        (value && value.trim() !== "") ||
        (value && yup.string().url().isValidSync(value))
      );
    })
    .required("Main image is required"),
  images: yup.array(yup.string().url("Each image must be a valid URL")),
  brand: yup.string().min(2, "Brand must be at least 2 characters").required(),
  description: yup
    .string()
    .min(10, "Description must be at least 10 characters")
    .required(),
  price: yup
    .number()
    .typeError("Price must be a number")
    .positive("Price must be positive")
    .required(),
  stock: yup
    .number()
    .typeError("Stock must be a number")
    .integer("Stock must be integer")
    .min(0, "Stock cannot be negative")
    .required(),
  discount: yup.number().min(0, "Discount cannot be negative").optional(),
  sizes: yup
    .array(yup.string())
    .min(1, "Please add at least one size")
    .required("Please add at least one size"),
  colors: yup.array(yup.string()).optional(),
  categories: yup
    .array(yup.string())
    .min(1, "Please select at least one category")
    .required("Please select at least one category"),
  tags: yup
    .array(yup.string())
    .min(1, "Please add at least one tag")
    .required("Please add at least one tag"),
});

const categories = [
  { id: "electronics", name: "Electronics" },
  { id: "clothing", name: "Clothing" },
  { id: "books", name: "Books" },
  { id: "home", name: "Home & Kitchen" },
  { id: "beauty", name: "Beauty & Personal Care" },
  { id: "sports", name: "Sports & Outdoors" },
  { id: "toys", name: "Toys & Games" },
];

export default function ProductForm({ product }) {
  const router = useRouter();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const isEdit = !!product;

  // State for image files and previews
  const [mainFile, setMainFile] = useState(null);
  const [mainPreview, setMainPreview] = useState(product?.mainImage || "");
  const [additionalFiles, setAdditionalFiles] = useState([]);
  const [additionalPreviews, setAdditionalPreviews] = useState(
    product?.images || []
  );

  // Initialize form with proper validation and revalidation
  const form = useForm({
    mode: "all", // Show errors as fields change and on blur for immediate feedback
    resolver: yupResolver(formSchema, {
      context: { mainFile, mainPreview }, // Pass the file state to the resolver context
    }),
    reValidateMode: "onChange", // Re-validate on every change for real-time feedback
    shouldFocusError: true, // Focus on first error field
    shouldUnregister: false, // Keep values for unmounted fields
    criteriaMode: "all", // Show all validation errors
    defaultValues: {
      name: product?.name || "",
      slug: product?.slug || "",
      desc: product?.desc || "",
      mainImage: product?.mainImage || "",
      images: product?.images || [],
      brand: product?.brand || "",
      description: product?.description || "",
      price: product?.price || "",
      stock: product?.stock || 0,
      discount: product?.discount || 0,
      sizes: product?.sizes || [],
      colors: product?.colors || [],
      categories: product?.categories || [],
      tags: product?.tags || [],
      specifications: product?.specifications || [],
      rating: product?.rating || 0,
      numReviews: product?.numReviews || 0,
    },
  });
  // Destructure helpers from form
  const {
    control,
    handleSubmit,
    setValue,
    watch,
    getValues,
    formState: { errors, touchedFields, isValid, isDirty },
  } = form;

  // Function to log form state for debugging
  const logFormState = () => {
    console.log("Form State:", {
      isValid,
      isDirty,
      errors: Object.keys(errors),
      errorDetails: errors,
      values: getValues(),
      descValue: getValues("desc"),
      descError: errors.desc,
      descTouched: touchedFields.desc,
      descriptionValue: getValues("description"),
      hasMainImage: !!mainFile || !!mainPreview,
      touchedFields,
    });
  };

  // Auto-generate slug from name if user hasn't edited slug
  const nameValue = watch("name");
  useEffect(() => {
    if (nameValue && !touchedFields.slug) {
      const newSlug = slugify(nameValue, { lower: true, strict: true });
      setValue("slug", newSlug);
    }
  }, [nameValue, touchedFields.slug, setValue]);

  // Re-validate mainImage whenever mainFile or mainPreview changes
  useEffect(() => {
    // Always validate mainImage when the image state changes
    form.trigger("mainImage");

    // Also force a full validation if we have an image (since that's usually what's missing)
    if (mainFile || mainPreview) {
      // Add a small delay to make sure the form state is updated
      setTimeout(() => {
        form.trigger();
        console.log("Form validation triggered after image change:", {
          isValid: form.formState.isValid,
          errors: Object.keys(form.formState.errors),
          mainImage: form.getValues("mainImage"),
          hasImage: !!mainFile || !!mainPreview,
        });
      }, 100);
    }
  }, [mainFile, mainPreview, form]);

  // Auto-validate desc field on component load
  useEffect(() => {
    // Give form time to initialize
    const timer = setTimeout(() => {
      console.log("Triggering validation for desc field");
      form.trigger("desc");

      // Touch the desc field to force error display
      form.register("desc", { required: true });

      // If we're in edit mode and desc is empty, show an error
      if (isEdit && !getValues("desc")) {
        form.setError("desc", {
          type: "required",
          message: "Short description is required",
        });
      }

      logFormState();
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  // Re-validate when desc changes
  const descValue = watch("desc");
  useEffect(() => {
    if (descValue !== undefined) {
      console.log(
        `Desc changed to: "${descValue}" (length: ${descValue?.length || 0})`
      );
      form.trigger("desc");
    }
  }, [descValue]);

  // Helper to upload a file to S3 via API with reliable progress tracking
  const uploadToS3 = async (file, index = 0, isMain = false) => {
    const statusKey = isMain ? "main" : "additional";

    try {
      // Validate file type before sending
      const allowedTypes = [
        "image/jpeg",
        "image/png",
        "image/webp",
        "image/gif",
      ];
      if (!allowedTypes.includes(file.type)) {
        toast({
          variant: "destructive",
          title: "Invalid file type",
          description: `Only jpg, png, webp and gif files are allowed. Got ${file.type}.`,
          duration: 5000,
        });
        setUploadProgress((prev) => ({
          ...prev,
          [statusKey]: { status: "error", progress: 0 },
        }));
        throw new Error(`Invalid file type: ${file.type}`);
      }

      // Check file size (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        toast({
          variant: "destructive",
          title: "File too large",
          description: "Maximum file size is 10MB",
          duration: 5000,
        });
        setUploadProgress((prev) => ({
          ...prev,
          [statusKey]: { status: "error", progress: 0 },
        }));
        throw new Error("File too large");
      }

      // Initialize upload status to loading with 0 progress
      setUploadProgress((prev) => ({
        ...prev,
        [statusKey]: { status: "loading", progress: 0 },
      }));

      // We're using the sanitized slug to create a folder structure in S3
      const slugVal = form.getValues("slug").replace(/\s+/g, "-").toLowerCase();
      const formData = new FormData();
      formData.append("file", file);
      formData.append("slug", slugVal);
      formData.append("index", index.toString());
      formData.append("isMain", isMain.toString());

      console.log(
        `Uploading ${
          isMain ? "main" : `additional #${index}`
        } image with slug: ${slugVal}`
      );

      // Update progress to show we're starting
      setUploadProgress((prev) => ({
        ...prev,
        [statusKey]: { status: "loading", progress: 10 },
      }));

      console.log("Preparing to make upload API request to /api/admin/upload");

      // Make the API request to upload with better error handling
      let res;
      try {
        res = await fetch("/api/admin/upload", {
          method: "POST",
          body: formData,
          cache: "no-store",
        });

        console.log("Upload API request completed with status:", res.status);
      } catch (fetchError) {
        console.error("Network error during upload:", fetchError);

        // Show a more specific error message for connection issues
        let errorMessage = "Failed to connect to the server";
        if (
          fetchError.message.includes("Failed to fetch") ||
          fetchError.message.includes("NetworkError") ||
          fetchError.message.includes("ECONNREFUSED")
        ) {
          errorMessage =
            "Connection to server failed. Please ensure the development server is running.";
        }

        toast({
          variant: "destructive",
          title: "Connection Error",
          description: errorMessage,
          duration: 5000,
        });

        setUploadProgress((prev) => ({
          ...prev,
          [statusKey]: { status: "error", progress: 0 },
        }));

        throw new Error(errorMessage);
      }

      // Update progress after request is sent
      setUploadProgress((prev) => ({
        ...prev,
        [statusKey]: { status: "loading", progress: 60 },
      }));

      if (!res.ok) {
        const errorData = await res
          .json()
          .catch(() => ({ error: "Unknown error" }));

        console.error("Upload API response error:", errorData);

        setUploadProgress((prev) => ({
          ...prev,
          [statusKey]: { status: "error", progress: 0 },
        }));

        // Provide more specific error messages based on the API response
        let errorMessage = errorData.error || "Failed to upload image";

        if (
          errorMessage.includes("bucket") &&
          errorMessage.includes("endpoint")
        ) {
          errorMessage =
            "S3 bucket configuration error. Please check your AWS settings.";
        } else if (errorMessage.includes("AccessDenied")) {
          errorMessage =
            "Access denied to S3 bucket. Please check your AWS credentials.";
        }

        toast({
          variant: "destructive",
          title: "Upload failed",
          description: errorMessage,
          duration: 5000,
        });

        throw new Error(errorMessage);
      }

      // Update progress after successful response
      setUploadProgress((prev) => ({
        ...prev,
        [statusKey]: { status: "loading", progress: 90 },
      }));

      const data = await res.json();

      if (!data.url) {
        throw new Error("Upload succeeded but no URL was returned");
      }

      console.log(`Successfully uploaded image: ${data.url}`);

      // Update progress to complete
      setUploadProgress((prev) => ({
        ...prev,
        [statusKey]: { status: "success", progress: 100 },
      }));

      return data.url;
    } catch (error) {
      console.error("S3 upload error:", error);
      setUploadProgress((prev) => ({
        ...prev,
        [statusKey]: { status: "error", progress: 0 },
      }));

      toast({
        variant: "destructive",
        title: "Upload failed",
        description: error.message || "An error occurred during upload",
        duration: 5000,
      });

      throw error;
    }
  };

  // State for upload status indicators
  const [uploadProgress, setUploadProgress] = useState({
    main: { status: "idle", progress: 0 }, // idle, loading, success, error
    additional: { status: "idle", progress: 0 },
  });
  const [colorInput, setColorInput] = useState("");
  const [tagInput, setTagInput] = useState("");
  const [sizeInput, setSizeInput] = useState("");

  // Dropzone for main image
  const { getRootProps: getMainRootProps, getInputProps: getMainInputProps } =
    useDropzone({
      accept: { "image/*": [] },
      maxFiles: 1,
      onDrop: (acceptedFiles) => {
        if (acceptedFiles.length > 0) {
          const file = acceptedFiles[0];
          console.log("Main image dropped:", file.name, file.size, "bytes");

          try {
            const url = URL.createObjectURL(file);
            setMainFile(file);
            setMainPreview(url);

            console.log("Main image preview created, updating form value");

            // Set a temporary value for mainImage to pass validation
            setValue("mainImage", "pending-upload", {
              shouldValidate: true,
              shouldDirty: true,
              shouldTouch: true,
            });

            // Clear any existing errors for mainImage
            form.clearErrors("mainImage");

            // Force validation
            setTimeout(() => {
              form.trigger();
              logFormState();
            }, 100);
          } catch (error) {
            console.error("Error creating object URL:", error);
            toast({
              variant: "destructive",
              title: "Error",
              description: "Failed to process the uploaded image",
              duration: 3000,
            });
          }

          // Show notification
          toast({
            title: "Main image added",
            description: "Main image has been added successfully.",
            duration: 2000,
          });
        }
      },
    });
  // Dropzone for additional images
  const { getRootProps: getAddRootProps, getInputProps: getAddInputProps } =
    useDropzone({
      accept: { "image/*": [] },
      onDrop: (acceptedFiles) => {
        const urls = acceptedFiles.map((file) => URL.createObjectURL(file));
        setAdditionalFiles((prev) => [...prev, ...acceptedFiles]);
        setAdditionalPreviews((prev) => [...prev, ...urls]);
      },
    });

  async function onSubmit(values) {
    console.log("Starting form submission...");

    // Force validate all fields to show errors
    const validationResult = await form.trigger();

    // Check if form has any validation errors
    if (!validationResult || Object.keys(form.formState.errors).length > 0) {
      const errorFields = Object.keys(form.formState.errors);

      console.log("Form validation failed:", errorFields);

      toast({
        variant: "destructive",
        title: "Validation Error",
        description: `Please correct the ${errorFields.length} error${
          errorFields.length !== 1 ? "s" : ""
        } in the form before submitting.`,
      });

      // Try to focus the first field with error
      if (errorFields.length > 0) {
        const firstErrorField = document.querySelector(
          `[name="${errorFields[0]}"]`
        );
        if (firstErrorField) {
          firstErrorField.focus();
          firstErrorField.scrollIntoView({
            behavior: "smooth",
            block: "center",
          });
        }
      }

      return;
    }

    console.log("Form validation passed");

    // Log validation state for debugging
    console.log("Form validation state:", {
      isValid: form.formState.isValid,
      validationResult,
      errors: Object.keys(form.formState.errors),
      mainImage: values.mainImage,
      hasMainFile: !!mainFile || !!mainPreview,
      desc: values.desc,
      descLength: values.desc?.length || 0,
    });

    // Check for any errors in the form and highlight them
    if (!validationResult || Object.keys(form.formState.errors).length > 0) {
      // Get all errors
      const errorFields = Object.keys(form.formState.errors);

      // Scroll to the first error field
      if (errorFields.length > 0) {
        const firstErrorField = document.querySelector(
          `[name="${errorFields[0]}"]`
        );
        if (firstErrorField) {
          firstErrorField.scrollIntoView({
            behavior: "smooth",
            block: "center",
          });
        }
      }

      toast({
        variant: "destructive",
        title: "Validation Error",
        description: `Please fix the ${errorFields.length} error${
          errorFields.length !== 1 ? "s" : ""
        } in the form before submitting.`,
        duration: 5000,
      });
      return;
    }

    setIsSubmitting(true);

    // Show a toast notification to indicate submission started
    toast({
      title: isEdit ? "Updating Product..." : "Creating Product...",
      description: "Please wait while we process your request.",
      duration: 5000,
    });

    try {
      // First, validate all required non-image fields that Yup might have missed
      // Validate array fields before submitting
      if (!values.sizes || values.sizes.length === 0) {
        form.setError("sizes", {
          type: "manual",
          message: "Please add at least one size",
        });
        toast({
          variant: "destructive",
          title: "Validation Error",
          description: "Please add at least one size",
          duration: 5000,
        });
        setIsSubmitting(false);
        return;
      }

      if (!values.categories || values.categories.length === 0) {
        form.setError("categories", {
          type: "manual",
          message: "Please select at least one category",
        });
        toast({
          variant: "destructive",
          title: "Validation Error",
          description: "Please select at least one category",
          duration: 5000,
        });
        setIsSubmitting(false);
        return;
      }

      if (!values.tags || values.tags.length === 0) {
        form.setError("tags", {
          type: "manual",
          message: "Please add at least one tag",
        });
        toast({
          variant: "destructive",
          title: "Validation Error",
          description: "Please add at least one tag",
          duration: 5000,
        });
        setIsSubmitting(false);
        return;
      }

      // Validate main image presence - but show option to continue anyway
      if (!mainFile && !mainPreview) {
        toast({
          variant: "warning",
          title: "Main image recommended",
          description:
            "Products typically require a main image. You can continue for testing.",
          duration: 5000,
        });

        // Ask user if they want to continue without an image (for testing purposes)
        const confirmContinue = window.confirm(
          "No main image selected. Would you like to continue anyway for testing purposes?"
        );

        if (!confirmContinue) {
          // Set a manual form error for mainImage
          form.setError("mainImage", {
            type: "manual",
            message: "Main product image is required",
          });
          return;
        } else {
          // Clear the error and use a placeholder
          form.clearErrors("mainImage");
          // Set a placeholder image URL for testing
          productData.mainImage =
            "https://placehold.co/600x400?text=Product+Image";
          console.log(
            "Using placeholder image for testing:",
            productData.mainImage
          );
        }
        setIsSubmitting(false);
        return;
      }

      // Clear any previous mainImage errors since we have a valid image
      form.clearErrors("mainImage");

      // Create a local copy of the values to avoid modifying the form values directly
      let productData = { ...values };

      // Remove temporary mainImage value if it exists
      if (productData.mainImage === "pending-upload") {
        delete productData.mainImage;
      }

      // Sanitize slug for all uploads
      const sanitizedSlug = values.slug.replace(/\s+/g, "-").toLowerCase();
      console.log(`Working with sanitized slug: ${sanitizedSlug}`);

      try {
        // 1. Handle main image upload
        if (mainFile) {
          toast({
            title: "Uploading main image...",
            description: "Please wait while we upload the main product image.",
            duration: 5000,
          });

          try {
            console.log("Starting main image upload...");
            // Upload main image with special naming
            productData.mainImage = await uploadToS3(mainFile, 0, true);
            console.log("Main image uploaded:", productData.mainImage);

            if (!productData.mainImage) {
              throw new Error("Failed to get URL for main image upload");
            }

            // Show success toast
            toast({
              title: "Main image uploaded",
              description: "Main image uploaded successfully",
              duration: 3000,
            });
          } catch (imageError) {
            console.error("Main image upload error:", imageError);
            toast({
              variant: "destructive",
              title: "Main Image Upload Failed",
              description: imageError.message || "Failed to upload main image",
              duration: 5000,
            });
            setIsSubmitting(false);
            return;
          }
        } else if (mainPreview && isEdit) {
          // In edit mode, keep the existing main image if no new one was uploaded
          productData.mainImage = mainPreview;
        }

        // 2. Handle additional images upload
        let additionalImageUrls = [];
        if (additionalFiles.length > 0) {
          toast({
            title: "Uploading additional images...",
            description: `Uploading ${additionalFiles.length} additional images...`,
            duration: 5000,
          });

          try {
            console.log("Starting additional images upload...");
            // Upload additional images in sequence to avoid overwhelming the server
            for (let i = 0; i < additionalFiles.length; i++) {
              console.log(
                `Uploading additional image ${i + 1} of ${
                  additionalFiles.length
                }...`
              );
              const fileUrl = await uploadToS3(additionalFiles[i], i, false);
              if (!fileUrl) {
                throw new Error(
                  `Failed to get URL for additional image ${i + 1}`
                );
              }
              additionalImageUrls.push(fileUrl);
              console.log(`Additional image ${i + 1} uploaded: ${fileUrl}`);
            }
            console.log("All additional images uploaded:", additionalImageUrls);

            // Show success toast
            toast({
              title: "Images uploaded",
              description: `${additionalImageUrls.length} additional images uploaded successfully`,
              duration: 3000,
            });
          } catch (imageError) {
            console.error("Additional image upload error:", imageError);
            toast({
              variant: "destructive",
              title: "Image Upload Failed",
              description:
                imageError.message || "Failed to upload additional images",
              duration: 5000,
            });
            setIsSubmitting(false);
            return;
          }
        }

        // Combine with existing uploaded images (if in edit mode)
        if (additionalImageUrls.length > 0) {
          const existingImages =
            isEdit && product?.images
              ? product.images.filter(
                  (img) => typeof img === "string" && img.trim() !== ""
                )
              : [];

          productData.images = [...existingImages, ...additionalImageUrls];
        } else {
          // Keep existing images if no new ones
          productData.images =
            isEdit && product?.images
              ? product.images.filter(
                  (img) => typeof img === "string" && img.trim() !== ""
                )
              : [];
        }

        console.log("Submitting product data:", productData);

        // Now submit the product data with image URLs to the API
        const apiUrl = "/api/admin/products";
        const apiMethod = isEdit ? "PUT" : "POST";
        const apiPayload = isEdit
          ? { id: product.id, ...productData }
          : productData;

        // Make sure we have all required data before API call
        if (!productData.mainImage) {
          console.error("Missing main image URL before API call");
          toast({
            variant: "destructive",
            title: "Error",
            description: "Missing main image URL",
            duration: 5000,
          });
          setIsSubmitting(false);
          return;
        }

        console.log(
          `Making ${apiMethod} request to ${apiUrl} with payload:`,
          apiPayload
        );

        toast({
          title: "Saving product data...",
          description: "Please wait while we save your product information.",
          duration: 5000,
        });

        const apiRes = await fetch(apiUrl, {
          method: apiMethod,
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(apiPayload),
          cache: "no-store", // Prevent caching
        });

        if (!apiRes.ok) {
          const err = await apiRes.json();
          console.error("Server error response:", err);

          // Handle server-side validation errors
          if (err.validationErrors) {
            toast({
              variant: "destructive",
              title: "Validation Error",
              description: "Please check the form for errors",
              duration: 5000,
            });

            // Set field errors from API response
            Object.entries(err.validationErrors || {}).forEach(
              ([field, message]) => {
                form.setError(field, {
                  type: "server",
                  message: message || "Invalid field value",
                });
              }
            );
            throw new Error("Validation failed");
          } else {
            throw new Error(err.message || err.error || "API error");
          }
        }

        const data = await apiRes.json();
        toast({
          variant: "success",
          title: isEdit ? "Product updated" : "Product created",
          description: `${data.product?.name || values.name} successfully ${
            isEdit ? "updated" : "created"
          }.`,
        });

        // Wait a moment before redirecting to ensure the toast is visible
        setTimeout(() => {
          router.push("/admin/products");
        }, 1000);
      } catch (error) {
        console.error("Error during upload or product save:", error);

        // Show a more detailed error message
        let errorMessage = "Failed to save product";

        // Try to extract a meaningful error message from the error
        if (error.message) {
          if (
            error.message.includes("duplicate key") ||
            error.message.includes("already exists")
          ) {
            errorMessage = "A product with this name or slug already exists.";
            form.setError("slug", {
              message: "This slug is already in use. Please choose another.",
            });
          } else if (error.message.includes("validation failed")) {
            errorMessage = "Please check all required fields and try again.";
          } else if (error.message.includes("Missing required fields")) {
            errorMessage =
              "Some required fields are missing. Please check all highlighted fields.";
          } else {
            // Extract the actual error message without the stack trace
            errorMessage = error.message.split("\n")[0];
          }
        }

        // Display the toast with the error message
        toast({
          variant: "destructive",
          title: "Error Saving Product",
          description: errorMessage,
          duration: 5000,
        });

        // Trigger form validation to show all field errors
        Object.keys(form.getValues()).forEach((key) => {
          form.trigger(key);
        });
      }
    } catch (error) {
      console.error("Outer error handling - Error saving product:", error);

      // Show a more detailed error message
      let errorMessage = "Failed to save product";

      // Try to extract a meaningful error message from the API response
      if (error.message) {
        if (
          error.message.includes("duplicate key") ||
          error.message.includes("already exists")
        ) {
          errorMessage = "A product with this name or slug already exists.";
          form.setError("slug", {
            message: "This slug is already in use. Please choose another.",
          });
        } else if (error.message.includes("validation failed")) {
          errorMessage = "Please check all required fields and try again.";
        } else if (error.message.includes("Missing required fields")) {
          errorMessage =
            "Some required fields are missing. Please check all highlighted fields.";
        } else {
          // Extract the actual error message without the stack trace
          errorMessage = error.message.split("\n")[0];
        }
      }

      // Display the toast with the error message
      toast({
        variant: "destructive",
        title: "Error Saving Product",
        description: errorMessage,
        duration: 5000,
      });

      // Also trigger form validation to show all field errors
      Object.keys(form.getValues()).forEach((key) => {
        form.trigger(key);
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">
          {isEdit ? "Edit Product" : "Add New Product"}
        </h1>
        <p className="text-muted-foreground mt-2">
          {isEdit
            ? "Update product information"
            : "Fill in the details to create a new product"}
        </p>
      </div>

      <div className="bg-card rounded-lg shadow-md border p-6 w-full">
        <Form {...form}>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Product Name <span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter product name"
                        {...field}
                        className={errors.name ? "border-red-500" : ""}
                      />
                    </FormControl>
                    {errors.name && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.name.message}
                      </p>
                    )}
                    <FormMessage className="text-red-500 font-medium" />
                  </FormItem>
                )}
              />

              <FormField
                control={control}
                name="slug"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Slug <span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter product slug"
                        {...field}
                        className={errors.slug ? "border-red-500" : ""}
                      />
                    </FormControl>
                    {errors.slug && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.slug.message}
                      </p>
                    )}
                    <FormMessage className="text-red-500 font-medium" />
                  </FormItem>
                )}
              />

              <FormField
                control={control}
                name="price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Price ($) <span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="0.01"
                        placeholder="0.00"
                        {...field}
                        className={errors.price ? "border-red-500" : ""}
                      />
                    </FormControl>
                    {errors.price && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.price.message}
                      </p>
                    )}
                    <FormMessage className="text-red-500 font-medium" />
                  </FormItem>
                )}
              />

              <FormField
                control={control}
                name="stock"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Stock <span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="0"
                        {...field}
                        className={errors.stock ? "border-red-500" : ""}
                      />
                    </FormControl>
                    {errors.stock && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.stock.message}
                      </p>
                    )}
                    <FormMessage className="text-red-500 font-medium" />
                  </FormItem>
                )}
              />

              <FormField
                control={control}
                name="brand"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Brand <span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter product brand"
                        {...field}
                        className={errors.brand ? "border-red-500" : ""}
                      />
                    </FormControl>
                    {errors.brand && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.brand.message}
                      </p>
                    )}
                    <FormMessage className="text-red-500 font-medium" />
                  </FormItem>
                )}
              />

              <FormField
                control={control}
                name="discount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Discount (%)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="0"
                        {...field}
                        className={errors.discount ? "border-red-500" : ""}
                      />
                    </FormControl>
                    {errors.discount && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.discount.message}
                      </p>
                    )}
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={control}
                name="sizes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Sizes <span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <Controller
                        name="sizes"
                        control={control}
                        render={({ field: { onChange, value } }) => (
                          <div>
                            <div
                              className={`flex flex-wrap gap-2 mb-2 ${
                                errors.sizes ? "text-red-500" : ""
                              }`}
                            >
                              {value.length === 0 && (
                                <p className="text-sm text-muted-foreground">
                                  No sizes added yet
                                </p>
                              )}

                              {value?.map((size, idx) => (
                                <div
                                  key={idx}
                                  className="flex items-center gap-2 px-3 py-1 bg-blue-100 text-blue-800 rounded-full"
                                >
                                  <span className="text-sm">{size}</span>
                                  <button
                                    type="button"
                                    onClick={() => {
                                      onChange(
                                        value.filter((_, i) => i !== idx)
                                      );
                                    }}
                                    className="text-muted-foreground hover:text-red-500"
                                  >
                                    <X className="w-4 h-4" />
                                  </button>
                                </div>
                              ))}
                            </div>
                            <div className="flex items-center gap-2">
                              <Input
                                placeholder="Add a size (S, M, L, XL, etc.)"
                                value={sizeInput}
                                onChange={(e) => setSizeInput(e.target.value)}
                                onKeyPress={(e) => {
                                  if (
                                    e.key === "Enter" &&
                                    sizeInput.trim() !== ""
                                  ) {
                                    e.preventDefault();
                                    if (
                                      sizeInput &&
                                      !value.includes(sizeInput)
                                    ) {
                                      onChange([...value, sizeInput.trim()]);
                                      setSizeInput("");
                                    }
                                  }
                                }}
                                className={`flex-1 ${
                                  errors.sizes ? "border-red-500" : ""
                                }`}
                              />
                              <Button
                                type="button"
                                onClick={() => {
                                  if (sizeInput && !value.includes(sizeInput)) {
                                    onChange([...value, sizeInput.trim()]);
                                    setSizeInput("");
                                  }
                                }}
                                variant="outline"
                              >
                                Add
                              </Button>
                            </div>
                          </div>
                        )}
                      />
                    </FormControl>
                    {errors.sizes && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.sizes.message}
                      </p>
                    )}
                    <FormMessage className="text-red-500 font-medium" />
                  </FormItem>
                )}
              />

              <FormField
                control={control}
                name="colors"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Colors (hex codes)</FormLabel>
                    <FormControl>
                      <Controller
                        name="colors"
                        control={control}
                        render={({ field: { onChange, value } }) => (
                          <div>
                            <div className="flex flex-wrap gap-2 mb-2">
                              {value?.map((color, idx) => (
                                <div
                                  key={idx}
                                  className="flex items-center gap-2"
                                >
                                  <div
                                    className="w-6 h-6 rounded-full"
                                    style={{ backgroundColor: color }}
                                  />
                                  <span className="text-sm">{color}</span>
                                  <button
                                    type="button"
                                    onClick={() => {
                                      onChange(
                                        value.filter((_, i) => i !== idx)
                                      );
                                    }}
                                    className="text-muted-foreground hover:text-red-500"
                                  >
                                    <X className="w-4 h-4" />
                                  </button>
                                </div>
                              ))}
                            </div>
                            <div className="flex items-center gap-2">
                              <Input
                                placeholder="Add a color hex code"
                                value={colorInput}
                                onChange={(e) => setColorInput(e.target.value)}
                                onKeyPress={(e) => {
                                  if (
                                    e.key === "Enter" &&
                                    colorInput.trim() !== ""
                                  ) {
                                    e.preventDefault();
                                    if (
                                      colorInput &&
                                      !value.includes(colorInput)
                                    ) {
                                      onChange([...value, colorInput.trim()]);
                                      setColorInput("");
                                    }
                                  }
                                }}
                                className="flex-1"
                              />
                              <Button
                                type="button"
                                onClick={() => {
                                  if (
                                    colorInput &&
                                    !value.includes(colorInput)
                                  ) {
                                    onChange([...value, colorInput.trim()]);
                                    setColorInput("");
                                  }
                                }}
                                variant="outline"
                              >
                                Add
                              </Button>
                            </div>
                          </div>
                        )}
                      />
                    </FormControl>
                    <FormDescription>
                      Enter hex color codes separated by commas (e.g. #FF0000)
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={control}
                name="categories"
                render={({ field: { value, onChange } }) => (
                  <FormItem>
                    <FormLabel>
                      Categories <span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <div
                        className={`flex flex-wrap gap-2 mb-2 p-2 border rounded-md ${
                          errors.categories
                            ? "border-red-500 bg-red-50"
                            : value.length > 0
                            ? "border-green-200 bg-green-50"
                            : "border-gray-200"
                        }`}
                      >
                        {value.length === 0 && (
                          <p className="text-sm text-muted-foreground">
                            No categories selected
                          </p>
                        )}

                        {value.map((cat) => {
                          const label =
                            categories.find((c) => c.id === cat)?.name || cat;
                          return (
                            <span
                              key={cat}
                              className="px-2 py-1 bg-green-100 text-green-800 rounded-full flex items-center gap-1"
                            >
                              {label}
                              <button
                                type="button"
                                onClick={() =>
                                  onChange(value.filter((c) => c !== cat))
                                }
                                className="text-red-500 hover:text-red-700 ml-1"
                              >
                                ×
                              </button>
                            </span>
                          );
                        })}
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {categories.map((opt) => (
                          <button
                            key={opt.id}
                            type="button"
                            onClick={() => {
                              if (!value.includes(opt.id))
                                onChange([...value, opt.id]);
                            }}
                            className={`px-3 py-1 border rounded ${
                              value.includes(opt.id)
                                ? "bg-green-500 text-white"
                                : errors.categories
                                ? "bg-red-50 border-red-200 text-gray-700"
                                : "bg-white text-gray-700"
                            }`}
                          >
                            {opt.name}
                          </button>
                        ))}
                      </div>
                    </FormControl>
                    {errors.categories && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.categories.message}
                      </p>
                    )}
                    <FormMessage className="text-red-500 font-medium" />
                  </FormItem>
                )}
              />

              <FormField
                control={control}
                name="tags"
                render={({ field: { value, onChange } }) => (
                  <FormItem>
                    <FormLabel>
                      Tags <span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <div
                        className={`flex flex-wrap gap-2 mb-2 p-2 border rounded-md ${
                          errors.tags
                            ? "border-red-500 bg-red-50"
                            : value.length > 0
                            ? "border-green-200 bg-green-50"
                            : "border-gray-200"
                        }`}
                      >
                        {value.length === 0 && (
                          <p className="text-sm text-muted-foreground">
                            No tags added yet
                          </p>
                        )}

                        {value.map((tag, idx) => (
                          <span
                            key={idx}
                            className="px-2 py-1 bg-purple-100 text-purple-800 rounded-full flex items-center gap-1"
                          >
                            {tag}
                            <button
                              type="button"
                              onClick={() =>
                                onChange(value.filter((t) => t !== tag))
                              }
                              className="text-red-500 hover:text-red-700 ml-1"
                            >
                              ×
                            </button>
                          </span>
                        ))}
                      </div>
                      <div className="flex items-center gap-2">
                        <Input
                          placeholder="Add a tag"
                          value={tagInput}
                          onChange={(e) => setTagInput(e.target.value)}
                          onKeyPress={(e) => {
                            if (e.key === "Enter" && tagInput.trim() !== "") {
                              e.preventDefault();
                              if (tagInput && !value.includes(tagInput)) {
                                onChange([...value, tagInput.trim()]);
                                setTagInput("");
                              }
                            }
                          }}
                          className={`flex-1 ${
                            errors.tags ? "border-red-500" : ""
                          }`}
                        />
                        <Button
                          type="button"
                          onClick={() => {
                            if (tagInput && !value.includes(tagInput)) {
                              onChange([...value, tagInput.trim()]);
                              setTagInput("");
                            }
                          }}
                          variant="outline"
                        >
                          Add
                        </Button>
                      </div>
                    </FormControl>
                    {errors.tags && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.tags.message}
                      </p>
                    )}
                    <FormMessage className="text-red-500 font-medium" />
                  </FormItem>
                )}
              />
            </div>

            {/* Specifications Section */}
            <div className="border rounded-lg p-5 bg-background/50">
              <h3 className="font-semibold text-lg mb-4">
                Product Specifications
              </h3>
              <p className="text-muted-foreground mb-4">
                Add technical specifications for your product (e.g., dimensions,
                weight, material, etc.)
              </p>

              <Controller
                name="specifications"
                control={control}
                render={({ field }) => {
                  return (
                    <div className="space-y-4">
                      {field.value && field.value.length > 0 ? (
                        <div className="rounded-lg border overflow-hidden">
                          <table className="w-full">
                            <thead className="bg-muted/50">
                              <tr>
                                <th className="text-left p-2 font-medium">
                                  Specification
                                </th>
                                <th className="text-left p-2 font-medium">
                                  Value
                                </th>
                                <th className="w-16"></th>
                              </tr>
                            </thead>
                            <tbody>
                              {field.value.map((spec, index) => (
                                <tr key={index} className="border-t">
                                  <td className="p-2">
                                    <Input
                                      value={spec.name}
                                      onChange={(e) => {
                                        const newSpecs = [...field.value];
                                        newSpecs[index].name = e.target.value;
                                        field.onChange(newSpecs);
                                      }}
                                      placeholder="e.g., Weight, Dimensions"
                                    />
                                  </td>
                                  <td className="p-2">
                                    <Input
                                      value={spec.value}
                                      onChange={(e) => {
                                        const newSpecs = [...field.value];
                                        newSpecs[index].value = e.target.value;
                                        field.onChange(newSpecs);
                                      }}
                                      placeholder="e.g., 1.2 kg, 15 x 10 x 5 cm"
                                    />
                                  </td>
                                  <td className="p-2 text-center">
                                    <Button
                                      type="button"
                                      variant="ghost"
                                      size="sm"
                                      onClick={() => {
                                        const newSpecs = [...field.value];
                                        newSpecs.splice(index, 1);
                                        field.onChange(newSpecs);
                                      }}
                                    >
                                      <X className="h-4 w-4" />
                                    </Button>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      ) : (
                        <div className="text-center py-6 border rounded-lg bg-muted/20">
                          <p className="text-muted-foreground">
                            No specifications added yet
                          </p>
                        </div>
                      )}

                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => {
                          field.onChange([
                            ...(field.value || []),
                            { name: "", value: "" },
                          ]);
                        }}
                        className="w-full"
                      >
                        <Plus className="mr-2 h-4 w-4" />
                        Add Specification
                      </Button>
                    </div>
                  );
                }}
              />
            </div>

            <FormField
              control={control}
              name="desc"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Short Description <span className="text-red-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Enter a short product description (at least 10 characters)"
                      className={`min-h-20 ${
                        errors.desc ? "border-red-500" : ""
                      }`}
                      {...field}
                      onBlur={(e) => {
                        field.onBlur();
                        form.trigger("desc");
                      }}
                    />
                  </FormControl>
                  {errors.desc && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.desc.message}
                    </p>
                  )}
                  <FormMessage className="text-red-500 font-medium" />
                </FormItem>
              )}
            />

            <FormField
              control={control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Full Description <span className="text-red-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Enter detailed product description"
                      className={`min-h-32 ${
                        errors.description ? "border-red-500" : ""
                      }`}
                      {...field}
                      onBlur={() => {
                        form.trigger("description");
                      }}
                    />
                  </FormControl>
                  {errors.description && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.description.message}
                    </p>
                  )}
                  <FormMessage className="text-red-500 font-medium" />
                </FormItem>
              )}
            />

            {/* Main Image Dropzone */}
            <div className="mb-6">
              <label className="block mb-2 font-medium">
                Main Image <span className="text-red-500">*</span>
              </label>
              <div
                {...getMainRootProps()}
                className={`border-2 border-dashed rounded-lg transition-colors
                  ${
                    mainPreview
                      ? "border-primary/30 bg-primary/5"
                      : errors.mainImage
                      ? "border-red-500 bg-red-50"
                      : "border-muted-foreground/25 hover:border-primary/50 hover:bg-primary/5"
                  } p-6 text-center cursor-pointer`}
              >
                <input {...getMainInputProps()} />
                {mainPreview ? (
                  <div className="relative">
                    <img
                      src={mainPreview}
                      alt="Main"
                      className="mx-auto h-48 object-contain rounded-md shadow-sm"
                    />
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setMainFile(null);
                        setMainPreview("");
                        // Clear the mainImage field value and trigger validation
                        setValue("mainImage", "", { shouldValidate: true });
                      }}
                      className="absolute top-2 right-2 bg-black/50 text-white p-1 rounded-full hover:bg-black/70 transition-colors"
                    >
                      <X size={16} />
                    </button>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-6 text-muted-foreground">
                    <ImageIcon className="h-12 w-12 mb-2 opacity-50" />
                    <p className="font-medium mb-1">
                      Drag & drop main product image
                    </p>
                    <p className="text-sm">or click to browse files</p>
                  </div>
                )}

                {errors.mainImage && (
                  <div className="text-red-500 text-sm mt-2 bg-red-50 p-1 rounded">
                    {errors.mainImage.message || "Main image is required"}
                  </div>
                )}

                {/* Upload Status Indicator */}
                {uploadProgress.main.status === "loading" && (
                  <div className="mt-3">
                    <div className="flex items-center justify-center gap-2 text-primary mb-1">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span className="text-sm font-medium">
                        Uploading: {uploadProgress.main.progress}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 h-1.5 rounded-full overflow-hidden">
                      <div
                        className="bg-primary h-full transition-all duration-300 ease-in-out"
                        style={{ width: `${uploadProgress.main.progress}%` }}
                      ></div>
                    </div>
                  </div>
                )}

                {uploadProgress.main.status === "success" && (
                  <div className="mt-3 flex items-center justify-center gap-2 text-green-600">
                    <CheckCircle className="h-4 w-4" />
                    <span className="text-sm">Upload complete</span>
                  </div>
                )}

                {uploadProgress.main.status === "error" && (
                  <div className="mt-3 flex items-center justify-center gap-2 text-red-600">
                    <AlertCircle className="h-4 w-4" />
                    <span className="text-sm">Upload failed</span>
                  </div>
                )}
              </div>
              <div className="text-muted-foreground text-xs mt-2">
                Recommended size: 1200×800px. Max size: 10MB.
              </div>
              {errors.mainImage && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.mainImage.message}
                </p>
              )}
            </div>

            {/* Additional Images Dropzone */}
            <div className="mb-6">
              <label className="block mb-2 font-medium">
                Additional Images
              </label>
              <div className="space-y-4">
                {/* Existing Images Preview */}
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                  {additionalPreviews.map((url, idx) => (
                    <div
                      key={idx}
                      className="relative group aspect-[4/3] bg-muted rounded-md overflow-hidden border"
                    >
                      <img
                        src={url}
                        alt={`Additional ${idx}`}
                        className="h-full w-full object-contain"
                      />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                        <button
                          type="button"
                          onClick={() => {
                            setAdditionalFiles(
                              additionalFiles.filter((_, i) => i !== idx)
                            );
                            setAdditionalPreviews(
                              additionalPreviews.filter((_, i) => i !== idx)
                            );
                          }}
                          className="bg-white text-red-600 p-1 rounded-full hover:bg-red-100 transition-colors"
                        >
                          <X size={16} />
                        </button>
                      </div>
                    </div>
                  ))}

                  {/* Add More Images Button */}
                  <div
                    {...getAddRootProps()}
                    className="border-2 border-dashed rounded-md aspect-[4/3] flex flex-col items-center justify-center text-muted-foreground cursor-pointer hover:border-primary/50 hover:bg-primary/5 transition-colors"
                  >
                    <input {...getAddInputProps()} multiple />
                    <Plus className="h-8 w-8 mb-1" />
                    <span className="text-xs font-medium">Add Images</span>
                  </div>
                </div>

                {/* Upload Status Indicator for Additional Images */}
                {uploadProgress.additional.status === "loading" && (
                  <div className="mt-3 p-2 bg-primary/5 rounded-md">
                    <div className="flex items-center justify-center gap-2 text-primary mb-1">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span className="text-sm font-medium">
                        Uploading additional images:{" "}
                        {uploadProgress.additional.progress}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 h-1.5 rounded-full overflow-hidden">
                      <div
                        className="bg-primary h-full transition-all duration-300 ease-in-out"
                        style={{
                          width: `${uploadProgress.additional.progress}%`,
                        }}
                      ></div>
                    </div>
                  </div>
                )}
              </div>
              <div className="text-muted-foreground text-xs mt-2">
                You can upload multiple additional product images. Max 10MB per
                image.
              </div>
            </div>

            <div className="flex justify-end gap-4 pt-6 border-t">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push("/admin/products")}
                disabled={isSubmitting}
                className="px-6"
              >
                Cancel
              </Button>

              <Button
                type="submit"
                onClick={() => {
                  // Force validate all fields before submit
                  form.trigger();
                }}
                disabled={
                  isSubmitting ||
                  // Special condition for main image - it's usually the problem field
                  (!mainFile && !mainPreview && errors.mainImage) ||
                  // Ignore mainImage error if we have a file/preview
                  Object.keys(errors).filter(
                    (key) => key !== "mainImage" || (!mainFile && !mainPreview)
                  ).length > 0
                }
                className={`px-8 ${
                  isSubmitting ||
                  (!mainFile && !mainPreview && errors.mainImage) ||
                  Object.keys(errors).filter(
                    (key) => key !== "mainImage" || (!mainFile && !mainPreview)
                  ).length > 0
                    ? "opacity-70 cursor-not-allowed bg-gray-400"
                    : "opacity-100 hover:bg-primary/90"
                }`}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {isEdit ? "Updating..." : "Creating..."}
                  </>
                ) : (
                  <>{isEdit ? "Update Product" : "Create Product"}</>
                )}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}
