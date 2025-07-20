"use client";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  CreditCard,
  Lock,
  Loader2,
  Package,
  UserCircle,
  Home,
  Briefcase,
  MapPin,
  Plus,
  Edit,
  Trash2,
} from "lucide-react";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { useAddress } from "@/helpers/useAddress";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

// Form validation schemas
const profileFormSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  email: z.string().email({ message: "Please enter a valid email address." }),
  phone: z.string().min(10, { message: "Please enter a valid phone number." }),
});

const addressFormSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  phoneNo: z
    .string()
    .min(10, { message: "Please enter a valid phone number." }),
  email: z.string().email({ message: "Please enter a valid email address." }),
  houseNo: z.string().min(1, { message: "House/flat no. is required." }),
  street: z.string().min(3, { message: "Street address is required." }),
  city: z.string().min(2, { message: "City must be at least 2 characters." }),
  state: z.string().min(2, { message: "State must be at least 2 characters." }),
  zipCode: z
    .string()
    .min(5, { message: "ZIP code must be at least 5 characters." }),
  country: z.string().min(2, { message: "Country is required." }),
  addressType: z.enum(["home", "work", "other"], {
    message: "Please select an address type.",
  }),
  isDefault: z.boolean().optional(),
});

const passwordFormSchema = z
  .object({
    currentPassword: z
      .string()
      .min(8, { message: "Password must be at least 8 characters." }),
    newPassword: z
      .string()
      .min(8, { message: "Password must be at least 8 characters." }),
    confirmPassword: z
      .string()
      .min(8, { message: "Password must be at least 8 characters." }),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState("personal");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const { data: session } = useSession();
  const router = useRouter();

  // Address management state
  const [currentAddressId, setCurrentAddressId] = useState(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [addressSubmitting, setAddressSubmitting] = useState(false);

  // Use the address management hook
  const {
    addresses,
    isLoading: addressLoading,
    fetchAddresses,
    addAddress,
    updateAddress,
    deleteAddress,
    setDefaultAddress,
  } = useAddress();

  const [userData, setUserData] = useState(null);

  // Initialize forms first to avoid the reference error
  const profileForm = useForm({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
    },
  });

  const addressForm = useForm({
    resolver: zodResolver(addressFormSchema),
    defaultValues: {
      name: session?.user?.name || "",
      email: session?.user?.email || "",
      phoneNo: "",
      houseNo: "",
      street: "",
      city: "",
      state: "",
      zipCode: "",
      country: "India",
      addressType: "home",
      isDefault: true,
    },
  });

  const editAddressForm = useForm({
    resolver: zodResolver(addressFormSchema),
    defaultValues: {
      name: "",
      email: "",
      phoneNo: "",
      houseNo: "",
      street: "",
      city: "",
      state: "",
      zipCode: "",
      country: "",
      addressType: "home",
      isDefault: false,
    },
  });

  // Fetch user data after initializing forms
  useEffect(() => {
    if (!session) {
      router.push("/signin");
      return;
    }

    async function fetchUserData() {
      setLoading(true);
      try {
        const response = await fetch("/api/user/profile");
        if (!response.ok) {
          throw new Error("Failed to fetch user data");
        }
        const data = await response.json();
        setUserData(data.user);

        // Reset form values with user data
        profileForm.reset({
          name: data.user.name || "",
          email: data.user.email || "",
          phone: data.user.phone || "",
        });

        addressForm.reset({
          address: data.user.address || "",
          city: data.user.city || "",
          state: data.user.state || "",
          zipCode: data.user.zipCode || "",
          country: data.user.country || "",
        });
      } catch (error) {
        console.error("Error fetching user data:", error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Could not load your profile data. Please try again.",
        });
      } finally {
        setLoading(false);
      }
    }

    fetchUserData();

    // Fetch addresses
    if (session) {
      fetchAddresses();
    }
  }, [session, router, toast, fetchAddresses]);

  const passwordForm = useForm({
    resolver: zodResolver(passwordFormSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  // Form submission handlers
  const onSubmitProfile = async (values) => {
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/user/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to update profile");
      }

      const data = await response.json();
      setUserData(data.user);

      toast({
        title: "Profile updated",
        description: "Your profile information has been updated successfully.",
      });

      // Refresh session if email was changed
      if (values.email !== session.user.email) {
        router.refresh();
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description:
          error.message ||
          "There was a problem updating your profile. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Address handlers
  const onAddAddress = async (values) => {
    setAddressSubmitting(true);
    try {
      await addAddress(values);
      addressForm.reset();
      // Close the dialog if open
      document.querySelector('[role="dialog"]')?.closest("dialog")?.close();
    } catch (error) {
      console.error("Error adding address:", error);
    } finally {
      setAddressSubmitting(false);
    }
  };

  const handleEditAddress = (address) => {
    setCurrentAddressId(address._id);
    editAddressForm.reset({
      name: address.name,
      email: address.email,
      phoneNo: address.phoneNo,
      houseNo: address.houseNo,
      street: address.street,
      city: address.city,
      state: address.state,
      zipCode: address.zipCode,
      country: address.country,
      addressType: address.addressType,
      isDefault: address.isDefault,
    });
    setIsEditDialogOpen(true);
  };

  const onUpdateAddress = async (values) => {
    if (!currentAddressId) return;

    setAddressSubmitting(true);
    try {
      await updateAddress(currentAddressId, values);
      setIsEditDialogOpen(false);
    } catch (error) {
      console.error("Error updating address:", error);
    } finally {
      setAddressSubmitting(false);
    }
  };

  const handleDeleteAddress = async (addressId) => {
    if (!window.confirm("Are you sure you want to delete this address?")) {
      return;
    }

    try {
      await deleteAddress(addressId);
    } catch (error) {
      console.error("Error deleting address:", error);
    }
  };

  const handleSetDefaultAddress = async (addressId) => {
    try {
      await setDefaultAddress(addressId);
    } catch (error) {
      console.error("Error setting default address:", error);
    }
  };

  // Legacy address handler for backward compatibility
  const onSubmitAddress = async (values) => {
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/user/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to update address");
      }

      const data = await response.json();
      setUserData(data.user);

      toast({
        title: "Address updated",
        description: "Your address information has been updated successfully.",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description:
          error.message ||
          "There was a problem updating your address. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const onSubmitPassword = async (values) => {
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/user/change-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          currentPassword: values.currentPassword,
          newPassword: values.newPassword,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to update password");
      }

      toast({
        title: "Password updated",
        description: "Your password has been updated successfully.",
      });

      passwordForm.reset({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description:
          error.message ||
          "There was a problem updating your password. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-16">
      <h1 className="text-3xl font-bold mb-8">My Profile</h1>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-24">
          <Loader2 className="h-16 w-16 animate-spin text-primary mb-4" />
          <p className="text-lg text-muted-foreground">
            Loading your profile...
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="md:col-span-1">
            <div className="bg-card rounded-lg border p-6">
              <div className="flex flex-col items-center text-center mb-6">
                <div className="h-24 w-24 rounded-full bg-primary/10 flex items-center justify-center mb-3">
                  <UserCircle className="h-12 w-12 text-primary" />
                </div>
                <h2 className="font-bold text-lg">
                  {userData?.name || "User"}
                </h2>
                <p className="text-muted-foreground">{userData?.email}</p>
              </div>

              <div className="space-y-2">
                <Button
                  variant={activeTab === "personal" ? "default" : "ghost"}
                  className="w-full justify-start"
                  onClick={() => setActiveTab("personal")}
                >
                  <UserCircle className="h-4 w-4 mr-2" />
                  Personal Info
                </Button>
                <Button
                  variant={activeTab === "address" ? "default" : "ghost"}
                  className="w-full justify-start"
                  onClick={() => setActiveTab("address")}
                >
                  <Package className="h-4 w-4 mr-2" />
                  Address
                </Button>
                <Button
                  variant={activeTab === "password" ? "default" : "ghost"}
                  className="w-full justify-start"
                  onClick={() => setActiveTab("password")}
                >
                  <Lock className="h-4 w-4 mr-2" />
                  Password
                </Button>
                <Button
                  variant={activeTab === "orders" ? "default" : "ghost"}
                  className="w-full justify-start"
                  asChild
                >
                  <a href="/orders">
                    <CreditCard className="h-4 w-4 mr-2" />
                    Orders
                  </a>
                </Button>
              </div>
            </div>
          </div>

          {/* Main content */}
          <div className="md:col-span-3">
            <div className="bg-card rounded-lg border p-6">
              <div className="mb-6">
                {activeTab === "personal" && (
                  <h2 className="text-xl font-bold">Personal Information</h2>
                )}
                {activeTab === "address" && (
                  <h2 className="text-xl font-bold">Address Information</h2>
                )}
                {activeTab === "password" && (
                  <h2 className="text-xl font-bold">Change Password</h2>
                )}
                {activeTab === "orders" && (
                  <h2 className="text-xl font-bold">Order History</h2>
                )}
              </div>

              {/* Personal Information Form */}
              {activeTab === "personal" && (
                <Form {...profileForm}>
                  <form
                    onSubmit={profileForm.handleSubmit(onSubmitProfile)}
                    className="space-y-6"
                  >
                    <FormField
                      control={profileForm.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Full Name</FormLabel>
                          <FormControl>
                            <Input placeholder="Your full name" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={profileForm.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email Address</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Your email address"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={profileForm.control}
                      name="phone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Phone Number</FormLabel>
                          <FormControl>
                            <Input placeholder="Your phone number" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Button type="submit" disabled={isSubmitting}>
                      {isSubmitting ? "Saving..." : "Save Changes"}
                    </Button>
                  </form>
                </Form>
              )}

              {/* Address Information Form */}
              {activeTab === "address" && (
                <Form {...addressForm}>
                  <form
                    onSubmit={addressForm.handleSubmit(onSubmitAddress)}
                    className="space-y-6"
                  >
                    <FormField
                      control={addressForm.control}
                      name="address"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Street Address</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Your street address"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={addressForm.control}
                        name="city"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>City</FormLabel>
                            <FormControl>
                              <Input placeholder="Your city" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={addressForm.control}
                        name="state"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>State/Province</FormLabel>
                            <FormControl>
                              <Input placeholder="Your state" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={addressForm.control}
                        name="zipCode"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>ZIP/Postal Code</FormLabel>
                            <FormControl>
                              <Input placeholder="Your ZIP code" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={addressForm.control}
                        name="country"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Country</FormLabel>
                            <FormControl>
                              <Input placeholder="Your country" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <Button type="submit" disabled={isSubmitting}>
                      {isSubmitting ? "Saving..." : "Save Changes"}
                    </Button>
                  </form>
                </Form>
              )}

              {/* Password Change Form */}
              {activeTab === "password" && (
                <Form {...passwordForm}>
                  <form
                    onSubmit={passwordForm.handleSubmit(onSubmitPassword)}
                    className="space-y-6"
                  >
                    <FormField
                      control={passwordForm.control}
                      name="currentPassword"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Current Password</FormLabel>
                          <FormControl>
                            <Input
                              type="password"
                              placeholder="Your current password"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={passwordForm.control}
                      name="newPassword"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>New Password</FormLabel>
                          <FormControl>
                            <Input
                              type="password"
                              placeholder="Your new password"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={passwordForm.control}
                      name="confirmPassword"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Confirm New Password</FormLabel>
                          <FormControl>
                            <Input
                              type="password"
                              placeholder="Confirm your new password"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Button type="submit" disabled={isSubmitting}>
                      {isSubmitting ? "Updating..." : "Update Password"}
                    </Button>
                  </form>
                </Form>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
