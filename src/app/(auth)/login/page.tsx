import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="max-w-md w-full space-y-8 p-8 bg-white shadow-lg rounded-xl">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900">Sign In</h2>
          <p className="mt-2 text-gray-600">
            Enter your credentials to start recording
          </p>
        </div>

        <form className="mt-8 space-y-6">
          <div className="space-y-4">
            <label htmlFor="email">Email</label>
            <Input type="text" className="w-full" name="email" id="email" />
            <label htmlFor="password">Password</label>
            <Input
              type="password"
              className="w-full"
              name="password"
              id="password"
            />
          </div>

          <Button type="submit" className="w-full">
            Log In
          </Button>
        </form>
      </div>
    </div>
  );
}
