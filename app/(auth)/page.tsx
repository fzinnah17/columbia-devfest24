import { LoginForm } from "@/components/auth/login-form";
import Image from "next/image";
export default function Login() {
    return (
        <div className="lg:flex justify-between items-center w-full px-44 xl:px-80">
            <div className="hidden lg:block">
                <Image alt="logo" width={400} height={400} src={'/logo.png'}  />

            </div>
            <LoginForm />
        </div>
    )
}