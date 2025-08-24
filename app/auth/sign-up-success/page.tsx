import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import Image from "next/image"
import { Mail } from "lucide-react"

export default function SignUpSuccessPage() {
  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        <div className="flex flex-col items-center gap-8">
          {/* GAMEFLUX Logo */}
          <div className="flex items-center gap-2">
            <Image src="/gameflux-logo.png" alt="GAMEFLUX" width={200} height={40} className="h-10 w-auto" />
          </div>

          <Card className="w-full bg-gray-900 border-gray-800">
            <CardHeader className="text-center">
              <div className="mx-auto w-12 h-12 bg-gameflux-green/20 rounded-full flex items-center justify-center mb-4">
                <Mail className="w-6 h-6 text-gameflux-green" />
              </div>
              <CardTitle className="text-2xl text-white">Check Your Email</CardTitle>
              <CardDescription className="text-gray-400">
                We've sent you a confirmation link to complete your registration
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center space-y-4">
              <p className="text-gray-300 text-sm">
                Click the link in your email to verify your account and start gaming on GAMEFLUX.
              </p>
              <p className="text-gray-400 text-xs">
                Didn't receive the email? Check your spam folder or try signing up again.
              </p>
              <div className="pt-4">
                <Button
                  asChild
                  className="w-full bg-gameflux-green hover:bg-gameflux-green/90 text-white font-semibold"
                >
                  <Link href="/auth/login">Back to Sign In</Link>
                </Button>
              </div>
            </CardContent>
          </Card>

          <div className="text-center">
            <Link href="/" className="text-gray-400 hover:text-white text-sm">
              ← Back to GAMEFLUX
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
