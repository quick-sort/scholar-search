'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Mail, Phone, Lock, User, ArrowRight } from 'lucide-react';

export default function LoginPage() {
  const [emailPhone, setEmailPhone] = useState('');
  const [password, setPassword] = useState('');
  const [loginType, setLoginType] = useState<'email' | 'phone'>('email');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement login logic
    console.log('Login with:', { emailPhone, password, loginType });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900 p-4">
      <Card className="w-full max-w-md shadow-xl">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-2xl font-bold">Welcome back</CardTitle>
          <CardDescription>Sign in to your account to continue</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="qrcode" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="qrcode">WeChat QR</TabsTrigger>
              <TabsTrigger value="password">Account Login</TabsTrigger>
            </TabsList>

            {/* WeChat QR Code Login */}
            <TabsContent value="qrcode" className="space-y-4">
              <div className="flex flex-col items-center justify-center space-y-4 py-8">
                <div className="relative group">
                  {/* QR Code Placeholder */}
                  <div className="w-48 h-48 bg-white dark:bg-slate-800 rounded-lg shadow-inner flex items-center justify-center border-2 border-slate-200 dark:border-slate-700">
                    <svg
                      className="w-40 h-40 text-slate-800 dark:text-slate-200"
                      viewBox="0 0 100 100"
                      fill="currentColor"
                    >
                      {/* Simple QR Code pattern */}
                      <rect x="10" y="10" width="20" height="20" />
                      <rect x="70" y="10" width="20" height="20" />
                      <rect x="10" y="70" width="20" height="20" />
                      <rect x="35" y="10" width="5" height="5" />
                      <rect x="45" y="10" width="5" height="5" />
                      <rect x="35" y="20" width="5" height="5" />
                      <rect x="50" y="15" width="5" height="5" />
                      <rect x="40" y="35" width="5" height="5" />
                      <rect x="35" y="45" width="5" height="5" />
                      <rect x="50" y="40" width="5" height="5" />
                      <rect x="45" y="50" width="5" height="5" />
                      <rect x="70" y="35" width="5" height="5" />
                      <rect x="75" y="45" width="5" height="5" />
                      <rect x="80" y="40" width="5" height="5" />
                      <rect x="70" y="50" width="5" height="5" />
                      <rect x="40" y="70" width="5" height="5" />
                      <rect x="50" y="75" width="5" height="5" />
                      <rect x="45" y="85" width="5" height="5" />
                      <rect x="70" y="70" width="5" height="5" />
                      <rect x="80" y="75" width="5" height="5" />
                      <rect x="75" y="85" width="5" height="5" />
                    </svg>
                  </div>
                  {/* WeChat Logo Overlay */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="bg-white dark:bg-slate-900 rounded-full p-3 shadow-lg">
                      <svg
                        className="w-12 h-12 text-green-500"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                      >
                        <path d="M8.5 2c-4.142 0-7.5 2.91-7.5 6.5 0 2.316 1.473 4.35 3.707 5.654L3.5 18l4.828-2.414C8.703 15.863 8.5 15.938 8.5 16c3.142 0 5.5-2.91 5.5-6.5S11.642 2 8.5 2zM13 6c-3.142 0-5.5 2.91-5.5 6.5 0 3.59 2.358 6.5 5.5 6.5.293 0 .703-.137 1.172-.414L19 22l-2.207-3.844C18.527 16.85 20 14.816 20 12.5c0-3.59-2.358-6.5-5.5-6.5h-1.5z" />
                      </svg>
                    </div>
                  </div>
                </div>
                <div className="text-center space-y-2">
                  <p className="text-sm font-medium">Scan with WeChat</p>
                  <p className="text-xs text-muted-foreground">
                    Open WeChat and scan the QR code to sign in
                  </p>
                </div>
              </div>
            </TabsContent>

            {/* Email/Phone + Password Login */}
            <TabsContent value="password" className="space-y-4">
              <div className="flex gap-2 mb-4">
                <Button
                  type="button"
                  variant={loginType === 'email' ? 'default' : 'outline'}
                  className="flex-1"
                  onClick={() => setLoginType('email')}
                >
                  <Mail className="w-4 h-4 mr-2" />
                  Email
                </Button>
                <Button
                  type="button"
                  variant={loginType === 'phone' ? 'default' : 'outline'}
                  className="flex-1"
                  onClick={() => setLoginType('phone')}
                >
                  <Phone className="w-4 h-4 mr-2" />
                  Phone
                </Button>
              </div>

              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="identifier">
                    {loginType === 'email' ? 'Email Address' : 'Phone Number'}
                  </Label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      {loginType === 'email' ? (
                        <Mail className="h-4 w-4 text-muted-foreground" />
                      ) : (
                        <Phone className="h-4 w-4 text-muted-foreground" />
                      )}
                    </div>
                    <Input
                      id="identifier"
                      type={loginType === 'email' ? 'email' : 'tel'}
                      placeholder={
                        loginType === 'email'
                          ? 'your.email@example.com'
                          : '+1 234 567 8900'
                      }
                      className="pl-10"
                      value={emailPhone}
                      onChange={(e) => setEmailPhone(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Lock className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <Input
                      id="password"
                      type="password"
                      placeholder="Enter your password"
                      className="pl-10"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between text-sm">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" className="rounded" />
                    <span className="text-muted-foreground">Remember me</span>
                  </label>
                  <a href="#" className="text-primary hover:underline">
                    Forgot password?
                  </a>
                </div>

                <Button type="submit" className="w-full">
                  Sign In
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </form>

              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-card px-2 text-muted-foreground">Or continue with</span>
                </div>
              </div>

              <Button variant="outline" className="w-full" type="button">
                <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                  <path
                    fill="#07C160"
                    d="M8.5 2c-4.142 0-7.5 2.91-7.5 6.5 0 2.316 1.473 4.35 3.707 5.654L3.5 18l4.828-2.414C8.703 15.863 8.5 15.938 8.5 16c3.142 0 5.5-2.91 5.5-6.5S11.642 2 8.5 2zM13 6c-3.142 0-5.5 2.91-5.5 6.5 0 3.59 2.358 6.5 5.5 6.5.293 0 .703-.137 1.172-.414L19 22l-2.207-3.844C18.527 16.85 20 14.816 20 12.5c0-3.59-2.358-6.5-5.5-6.5h-1.5z"
                  />
                </svg>
                WeChat
              </Button>
            </TabsContent>
          </Tabs>

          <div className="mt-6 text-center text-sm">
            <span className="text-muted-foreground">Don't have an account? </span>
            <a href="#" className="text-primary hover:underline font-medium">
              Sign up
            </a>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
