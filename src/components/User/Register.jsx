import { useFormik } from "formik";
import * as Yup from "yup";
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { registerAPI } from "../../APIServices/users/usersAPI";
import AlertMessage from "../Alert/AlertMessage";
import { create } from "../../APIServices/Api";

const Register = () => {
    //navigate
    const navigate = useNavigate();

    // user mutation
    const userMutation = useMutation({
        mutationKey: ["user-registration"],
        mutationFn: registerAPI,
    });

    // formik config
    const formik = useFormik({
        // initial data
        initialValues: {
            username: "",
            email: "",
            password: "",
        },
        // validation
        validationSchema: Yup.object({
            username: Yup.string().required("Username is required"),
            email: Yup.string().email("Enter valid email").required("Email is required"),
            password: Yup.string().required("Password is required"),
        }),
        // submit
        onSubmit: async (values) => {
            try {
                console.log(values);
                await userMutation.mutateAsync(values);  // Wait for registration
        
                // Save email
                localStorage.setItem("email", values.email);
        
                // Send OTP
                await create("/sendOtp", { email: values.email });
        
                // Navigate to verification page
                navigate("/verify", { state: {from: "signup" } });

            } catch (err) {
                console.log(err);
            }
        },
        
    });
    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-50">
            <div className="w-full max-w-md p-8 bg-white rounded-2xl shadow-lg">
                <form onSubmit={formik.handleSubmit} className="space-y-4 text-left">
                    <div className="mb-6 text-center">
                        <h2 className="text-2xl font-bold text-gray-800 mb-1">Create an Account</h2>
                        <p className="text-sm text-gray-500">
                            Already have an account?{" "}
                            <Link
                                to="/login"
                                className="text-blue-600 hover:underline font-medium"
                            >
                                Login
                            </Link>
                        </p>
                    </div>

                    {/* show alert */}
                    {userMutation.isPending && (
                        <AlertMessage type="loading" message="Loading please wait..." />
                    )}
                    {userMutation.isSuccess && (
                        <AlertMessage type="success" message="User Registrated successfully" />
                    )}
                    {userMutation.isError && (
                        <AlertMessage
                            type="error"
                            message={userMutation.error.response.data.message}
                        />
                    )}
                    {/* Username */}
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Username
                        </label>
                        <input
                            type="text"
                            placeholder="Enter username"
                            {...formik.getFieldProps("username")}
                            className="w-full px-4 py-3 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 placeholder-gray-400"
                        />
                        {/* error */}
                        {formik.touched.username && formik.errors.username && (
                            <div className="text-red-500 mt-1">{formik.errors.username}</div>
                        )}
                    </div>

                    {/* Email */}
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Email
                        </label>
                        <input
                            type="email"
                            placeholder="johndoe@email.com"
                            {...formik.getFieldProps("email")}
                            className="w-full px-4 py-3 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 placeholder-gray-400"
                        />
                        {/* error */}
                        {formik.touched.email && formik.errors.email && (
                            <div className="text-red-500 mt-1">{formik.errors.email}</div>
                        )}
                    </div>

                    {/* Password */}
                    <div className="mb-6">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Password
                        </label>
                        <div className="relative">
                            <input
                                type="password"
                                placeholder="Enter password"
                                {...formik.getFieldProps("password")}
                                className="w-full px-4 py-3 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 placeholder-gray-400"
                            />
                            <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="20"
                                    height="20"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        d="M12 4.5c-3.48 0-6.63 2.18-8.57 5.25a9.772 9.772 0 0 0 0 4.5C5.37 17.32 8.52 19.5 12 19.5s6.63-2.18 8.57-5.25a9.772 9.772 0 0 0 0-4.5C18.63 6.68 15.48 4.5 12 4.5Zm0 11a3.75 3.75 0 1 1 0-7.5 3.75 3.75 0 0 1 0 7.5Z"
                                        fill="#A3A3A3"
                                    />
                                </svg>
                            </div>

                        </div>
                    </div>
                    {/* error */}
                    {formik.touched.password && formik.errors.password && (
                        <div className="text-red-500 mt-1">{formik.errors.password}</div>
                    )}

                    {/* Submit Button */}
                    <button
                        type="submit"
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition duration-200"
                    >
                        Sign Up
                    </button>

                    {/* Divider */}
                    <div className="my-6 text-center text-gray-400 text-sm">or</div>

                    {/* Google Login */}
                    <button
                        type="button"
                        className="w-full flex items-center justify-center gap-3 py-3 border rounded-lg bg-white hover:bg-gray-100 transition duration-200"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="20"
                            height="20"
                            fill="none"
                            viewBox="0 0 24 24"
                        >
                            <path
                                fill="#4285F4"
                                d="M22.5 12.227c0-.683-.061-1.343-.175-1.982H12v3.755h5.906a5.065 5.065 0 0 1-2.197 3.325v2.76h3.543c2.076-1.913 3.248-4.727 3.248-7.858z"
                            />
                            <path
                                fill="#34A853"
                                d="M12 23c2.91 0 5.352-.964 7.136-2.615l-3.543-2.76c-.982.657-2.23 1.042-3.593 1.042-2.758 0-5.09-1.86-5.922-4.366H2.43v2.738A11.998 11.998 0 0 0 12 23z"
                            />
                            <path
                                fill="#FBBC04"
                                d="M6.078 14.3A7.191 7.191 0 0 1 5.5 12c0-.796.137-1.563.378-2.3V6.962H2.43A11.996 11.996 0 0 0 0 12c0 1.934.464 3.765 1.278 5.379l4.8-3.079z"
                            />
                            <path
                                fill="#EA4335"
                                d="M12 4.754c1.584 0 3.002.547 4.122 1.62l3.093-3.093C17.348 1.092 14.91 0 12 0A11.998 11.998 0 0 0 2.43 6.961l4.8 3.079C6.91 7.86 9.242 4.754 12 4.754z"
                            />
                        </svg>
                        <span className="text-sm font-medium text-gray-700">
                            Sign up with Google
                        </span>
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Register;
