"use client"
import Image from "next/image";
import GlassButton from "@/components/ui/backbutton";
import { ForgotPasswordForm } from "@/components/forgot-password-form";
import { useRouter } from "next/navigation";

export default function Page() {
  const router = useRouter();
  return (
    <div
      className="relative min-h-screen w-full bg-cover bg-center flex flex-col items-center justify-center p-6"
      style={{ backgroundImage: "url('/images/landingpicture.jpg')"}}
    >
      {/* Back button */}
      <div className="fixed top-4 left-4 z-20">
        <GlassButton
          className="text-sm md:text-base"
          onClick={() => router.back()}
        >
          ← Back
        </GlassButton>
      </div>
      
      {/* Logo */}
      <div className="absolute top-10 w-full flex justify-center">
        <Image
          src="/images/syncc.png"
          alt="SportSync logo"
          width={120}
          height={120}
          className="drop-shadow-lg"
          priority
        />
      </div>

       {/* Heading */}
      <div className="text-center mt-40 mb-10 drop-shadow-lg">
        <h1 className="text-4xl font-semibold text-white">Forgot your password?</h1>
        <p className="text-white/80 mt-2">Reset access to your SportSync account</p>
      </div>

      {/* Form */}
      <div className="w-full max-w-md">
        <ForgotPasswordForm />
      </div>
    </div>
  );
}
