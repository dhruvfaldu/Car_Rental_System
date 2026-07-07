import AuthLayout from "@/components/auth/AuthLayout";
import RegisterForm from "@/components/auth/RegisterForm";
export default function Register() {
  return (
    <AuthLayout
      title="Create Account"
      subtitle="Create your account to rent your dream car."
    >
      <RegisterForm />
    </AuthLayout>
  );
}