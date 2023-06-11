import Head from "next/head";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import FormLayout from "../layouts/FormLayout";
import Link from "next/link";
import styles from "../styles/Form.module.css";
import Image from "next/image";
import { IMAGES } from "../assets";
import { HiAtSymbol, HiFingerPrint, HiUser } from "react-icons/hi";
import { useEffect, useRef, useState } from "react";
import { createUser } from "../helpers/useAuth";
import { useRouter } from "next/router";

const schema = yup.object().shape({
  name: yup.string().required("Full Name is required"),
  email: yup
    .string()
    .email("Must be a valid email")
    .max(255)
    .required("Email is required"),
  password: yup
    .string()
    .required("Password is mendatory")
    .min(3, "Password must be at 3 char long"),
  cpassword: yup
    .string()
    .required("Password is mendatory")
    .oneOf([yup.ref("password")], "Passwords does not match"),
});

export default function SignUp() {
  const router = useRouter();
  const captchaRef = useRef();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });
  const onSubmit = (data) => {
    postDetails(data);
  };
  const postDetails = async (data) => {
    // const getUserIPFromAPI = async () => {
    //   const response = await fetch("https://api.ipify.org?format=json");
    //   const data = await response.json();
    //   console.log(data.ip);
    //   return data.ip;
    // };
    // const userIp = await getUserIPFromAPI();
    // const token = captchaRef.current.getValue();
    // const newData = { ...data, recaptchaToken: token, userIp: userIp };
    console.log("data", data);
    const res = await createUser(data);
    // if (res) captchaRef.current.reset();
    if (res) router.push("/login");
  };

  const [show, setShow] = useState({ pass: false, cpass: false });
  return (
    <FormLayout>
      <Head>
        <title>Ecomm. - SignUp</title>
      </Head>
      <section className="w-3/4 mx-auto flex flex-col gap-10">
        <div className="title">
          <h1 className="text-gray-800 text-4xl font-bold py-4">
            <Link href={"/"}>Ecomm.</Link>
          </h1>
          <p className="w-3/4 mx-auto text-gray-400">Join Us!</p>
        </div>
        <form className="flex flex-col gap-5" onSubmit={handleSubmit(onSubmit)}>
          <div>
            <div className={styles.input_group}>
              <input
                type="text"
                className={styles.input_text}
                name="name"
                placeholder="Name"
                {...register("name")}
              />

              <span className="icon flex items-center px-4">
                <HiUser size={25} />
              </span>
            </div>
            {errors.name && (
              <p className={styles.form_err}>{errors.name.message}</p>
            )}
          </div>

          <div>
            <div className={styles.input_group}>
              <input
                type="text"
                className={styles.input_text}
                name="email"
                placeholder="Email"
                {...register("email")}
              />

              <span className="icon flex items-center px-4">
                <HiAtSymbol size={25} />
              </span>
            </div>
            {errors.email && (
              <p className={styles.form_err}>{errors.email.message}</p>
            )}
          </div>

          <div>
            <div className={styles.input_group}>
              <input
                type={`${show.pass ? "text" : "password"}`}
                className={styles.input_text}
                name="password"
                placeholder="Password"
                {...register("password")}
              />

              <span
                className="icon flex items-center px-4"
                onClick={() => setShow({ ...show, pass: !show.pass })}
              >
                <HiFingerPrint size={25} />
              </span>
            </div>
            {errors.password && (
              <p className={styles.form_err}>{errors.password.message}</p>
            )}
          </div>
          <div>
            <div className={styles.input_group}>
              <input
                type={`${show.cpass ? "text" : "password"}`}
                className={styles.input_text}
                name="cpassword"
                placeholder="Confirm Password"
                {...register("cpassword")}
              />

              <span
                className="icon flex items-center px-4"
                onClick={() => setShow({ ...show, cpass: !show.cpass })}
              >
                <HiFingerPrint size={25} />
              </span>
            </div>
            {errors.cpassword && (
              <p className={styles.form_err}>{errors.cpassword.message}</p>
            )}
          </div>

          <button className={styles.btn} type="submit">
            Create Account
          </button>
          <p className="text-center text-gray-400">
            dont have an account yet?{" "}
            <Link
              className="no-underline border-b border-blue text-blue-700"
              href={"/login"}
            >
              LogIn
            </Link>
          </p>
        </form>
      </section>
    </FormLayout>
  );
}
