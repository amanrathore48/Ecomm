import Head from "next/head";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import FormLayout from "../layouts/FormLayout";
import Link from "next/link";
import styles from "../styles/Form.module.css";
import Image from "next/image";
import { IMAGES } from "../assets";
import { HiAtSymbol, HiFingerPrint } from "react-icons/hi";
import { useDebugValue, useState } from "react";
import { useRouter } from "next/router";
import { signIn } from "next-auth/react";

const schema = yup.object().shape({
  email: yup
    .string()
    .email("Must be a valid email")
    .max(255)
    .required("Email is required"),
  password: yup
    .string()
    .required("Password is mendatory")
    .min(3, "Password must be at 3 char long"),
});

export default function Login() {
  const router = useRouter();
  const [show, setShow] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });
  const onSubmit = async (data) => {
    const status = await signIn("credentials", {
      redirect: false,
      email: data.email,
      password: data.password,
      callbackUrl: "/",
    });

    if (status.ok) router.push(status.url);
  };
  const handleGoogle = async () => {
    signIn("google", { callbackUrl: "http://localhost:3000" });
  };
  return (
    <>
      <Head>
        <title>Ecomm. LogIn</title>
      </Head>
      <FormLayout>
        <div className="w-full p-8 mx-auto flex flex-col gap-10">
          <div className="title">
            <h1 className="text-gray-800 text-4xl font-bold py-4 font-pango">
              <Link href={"/"}>Ecomm.</Link>
            </h1>
            <p className="w-3/4 mx-auto text-gray-400">Welcome to Ecomm.</p>
          </div>
          <form
            className="flex flex-col gap-5"
            onSubmit={handleSubmit(onSubmit)}
          >
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
                  type={`${show ? "text" : "password"}`}
                  className={styles.input_text}
                  name="password"
                  placeholder="Password"
                  {...register("password")}
                />

                <span
                  className="icon flex items-center px-4"
                  onClick={() => setShow(!show)}
                >
                  <HiFingerPrint size={25} />
                </span>
              </div>
              {errors.password && (
                <p className={styles.form_err}>{errors.password.message}</p>
              )}
            </div>

            <div>
              <button className={styles.btn} type="submit">
                LogIn
              </button>
            </div>
            {/* <div className="input-btn">
              <button
                onClick={handleGoogle}
                type="button"
                className={styles.btn_auth}
              >
                Sign In with Google{" "}
                <Image
                  src={IMAGES.gsvg}
                  alt="google"
                  width="20"
                  height={20}
                ></Image>
              </button>
            </div> */}
          </form>
          <p className="text-center text-gray-400">
            dont have an account yet?{" "}
            <Link
              className="no-underline border-b border-blue text-blue-700"
              href={"/signup"}
            >
              Sign Up
            </Link>
          </p>
        </div>
      </FormLayout>
    </>
  );
}
