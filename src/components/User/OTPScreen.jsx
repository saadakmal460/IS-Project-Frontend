import { useState, useRef, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import AlertMessage from "../Alert/AlertMessage";
import { create } from "../../APIServices/Api";
import { useDispatch, useSelector } from "react-redux";
import { signInFailure, signInStart, signInSuccess } from "../../Redux/UserSlice";

export default function OTPVerification() {
    const navigate = useNavigate();
    const [otp, setOtp] = useState(["", "", "", ""]);
    const [timer, setTimer] = useState(180);
    const [canResend, setCanResend] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [loading, setLoading] = useState(false);
    const inputRefs = [useRef(), useRef(), useRef(), useRef()];

    const dispatch = useDispatch()

    const email = localStorage.getItem("email");

    const location = useLocation();
    const { from } = location.state || {};

    useEffect(() => {
        const sendOtp = async () => {
            if (email) {
                try {
                    await create("/sendOtp", { email });
                } catch (error) {
                    console.error("Failed to send OTP:", error);
                }
            }
        };

        sendOtp();
    }, [email]);

    useEffect(() => {
        if (timer > 0) {
            const interval = setInterval(() => setTimer((prev) => prev - 1), 1000);
            return () => clearInterval(interval);
        } else {
            setCanResend(true);
        }
    }, [timer]);

    const handleChange = (index, e) => {
        const value = e.target.value.replace(/\D/, "");
        const newOtp = [...otp];

        if (value) {
            newOtp[index] = value;
            setOtp(newOtp);
            if (index < 3) inputRefs[index + 1].current.focus();
        } else {
            newOtp[index] = "";
            setOtp(newOtp);
            if (index > 0) inputRefs[index - 1].current.focus();
        }
    };

    const handleKeyDown = (index, e) => {
        if (e.key === "Backspace" && !otp[index] && index > 0) {
            inputRefs[index - 1].current.focus();
        }
    };

    const verifyOtp = async () => {
        const otpString = otp.join("");
        if (otpString.length !== 4) {
            toast.error("Please enter a valid 4-digit OTP.");
            return;
        }

        try {
            setLoading(true);
            dispatch(signInStart());
            if (from === "signup") {
                const response = await create("/verifyotp", { email, otp: otpString });
                if (response.status === 200) {
                    toast.success('Account created sucessfully. Please signin to continue');
                    setLoading(false);
                    localStorage.removeItem("email");

                    navigate("/login");
                } else {
                    setLoading(false);
                    toast.error(response.data);
                }
            } else {
                const response = await create("/loginOtp", { email, otp: otpString });
                if (response.status === 200) {
                    dispatch(signInSuccess(response.data));
                    // toast.success('Account created sucessfully. Please signin to continue');
                    setLoading(false);
                    localStorage.removeItem("email");

                    navigate("/summerize");
                } else {
                    setLoading(false);
                    toast.error(response.data);
                }
            }
        } catch (error) {
            setLoading(false);
            dispatch(signInFailure(err.message || "An unexpected error occurred"));
            console.error("Error verifying OTP:", error);
            toast.error(error.message || "Something went wrong. Please try again.");
        }
    };

    const handleResend = async () => {
        if (!canResend) return;
        try {
            setLoading(true);
            const response = await create("/sendotp", { email });
            if (response.status === 200) {
                toast.success("OTP resent successfully.");
                setOtp(["", "", "", ""]);
                setTimer(180);
                setLoading(false);

                setCanResend(false);
            } else {
                setLoading(false);

                toast.error("Failed to resend OTP.");
            }
        } catch (error) {
            setLoading(false);
            console.error("Error resending OTP:", error);
            toast.error(error.message || "Failed to resend OTP.");
        }
    };

    return (
        <>
            <div className="flex justify-center items-center min-h-screen  px-4">

                <div className="p-10 rounded-2xl border border-blue-600 shadow-lg w-full max-w-md text-center min-h-[550px] space-y-6">

                    <img
                        src="https://img.icons8.com/ios-filled/50/new-post.png"
                        alt="Email Icon"
                        className="mx-auto mb-6"
                    />
                    <h2 className="text-2xl font-extrabold text-blue-600">Verify Your Account</h2>
                    <p className="text-black">Check Your Email For OTP</p>
                    <p className="text-black text-sm mt-4">
                        Your email is {email}.{" "}
                    </p>

                    <div className="flex justify-center gap-4 my-8">
                        {otp.map((digit, index) => (
                            <input
                                key={index}
                                type="text"
                                maxLength="1"
                                value={digit}
                                ref={inputRefs[index]}
                                onChange={(e) => handleChange(index, e)}
                                onKeyDown={(e) => handleKeyDown(index, e)}
                                className="w-14 h-14 text-2xl text-center rounded-lg border text-black border-blue-600 placeholder-white focus:outline-none focus:ring focus:ring-blue-600"
                            />
                        ))}
                    </div>

                    <p className="text-black text-sm">
                        Didn’t Receive?{" "}
                        {canResend ? (
                            <span
                                onClick={handleResend}
                                className="text-blue-600 font-medium cursor-pointer"
                            >
                                Resend
                            </span>
                        ) : (
                            <span className="font-semibold text-blue-600">{timer} s</span>
                        )}
                    </p>

                    <button
                        disabled={loading}
                        onClick={verifyOtp}
                        className="w-full bg-blue-600 font-bold text-gray-100 py-4 rounded-lg hover:bg-blue-700 cursor-pointer transition-all duration-300 ease-in-out  focus:shadow-outline focus:outline-none"
                    >
                        {loading ? (
                            "C"
                        ) : (
                            "Continue"
                        )}
                    </button>
                    {
                        loading ? (<AlertMessage type="loading" message="Loading please wait..." />) :
                            (<></>)

                    }

                </div>
            </div>


        </>
    );
}