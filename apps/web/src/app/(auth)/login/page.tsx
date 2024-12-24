'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { zodResolver } from '@hookform/resolvers/zod';
import { authClient } from '@repo/auth/client';
import { AlertCircleIcon, Moon, Sun, WebhookIcon } from 'lucide-react';
import { useTheme } from 'next-themes';
import { SubmitHandler, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';

import { michroma } from '@/lib/fonts';
import { cn } from '@/lib/utils';
import { useIsMounted } from '@/components/hooks/use-is-mounted';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';

const loginSchema = z.object({
  username: z.string(),
  password: z.string(),
});

export default function Page() {
  const router = useRouter();
  const isMounted = useIsMounted();

  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: '',
      password: '',
    },
  });

  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isPending, setIsPending] = useState(false);

  const onSubmit: SubmitHandler<z.infer<typeof loginSchema>> = async (
    values
  ) => {
    setIsPending(true);
    setErrorMessage(null);

    // loginMutation.mutate(values, {
    //   onSuccess: () => {
    //     router.replace('/');
    //   },
    //   onError: (err) => {
    //     if (!config.isProd) console.log('err =>', err);
    //     setErrorMessage("Email or Password that you've entered is incorrect!");
    //   },
    //   onSettled: () => {
    //     setIsPending(false);
    //   },
    // });

    const { data, error } = await authClient.signIn.username(
      {
        username: values.username,
        password: values.password,
      },
      {
        onRequest: () => {
          setIsPending(true);
        },
        onSuccess: () => {
          toast.success('Login Success');
        },
        onError: (ctx) => {
          toast.error(ctx.error.message);
        },
      }
    );

    setIsPending(false);
  };

  return (
    // eslint-disable-next-line tailwindcss/classnames-order
    <div className='bg-dot-black/[0.2] dark:bg-dot-white/[0.2] relative flex min-h-screen w-full flex-col items-center justify-center bg-white dark:bg-black'>
      {isMounted && <ThemeToggler />}

      {/* Radial gradient for the container to give a faded look */}
      <div className='pointer-events-none absolute inset-0 flex items-center justify-center bg-gray-300 [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)] dark:bg-black' />

      <div className='flex max-w-max items-center gap-x-2'>
        <WebhookIcon className='size-10 shrink-0 text-sky-400' />{' '}
        <span
          className={cn(
            michroma.className,
            'text-[1.875rem] font-semibold tracking-wider group-hover:inline-block'
          )}
        >
          CMS
        </span>{' '}
      </div>

      {/* <h2 className='mb-8 text-5xl font-bold'>Welcome Back</h2> */}
      <p className='relative z-20 from-neutral-200 to-neutral-500 bg-clip-text py-8 text-4xl font-bold sm:text-5xl dark:bg-gradient-to-b dark:text-transparent'>
        Welcome back
      </p>

      <div className='w-full max-w-[460px] rounded-xl border bg-white p-8 shadow-lg dark:border-none dark:bg-[#182125] dark:shadow-none'>
        <h2 className='mb-4 text-center text-2xl font-semibold'>Login</h2>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
            <FormField
              control={form.control}
              name='username'
              render={({ field }) => (
                <FormItem>
                  <FormLabel className='opacity-60'>Username</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder='John Doe'
                      className='bg-gray-100 dark:bg-black/40'
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='password'
              render={({ field }) => (
                <FormItem>
                  <FormLabel className='opacity-60'>Password</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type='password'
                      placeholder=''
                      className='bg-gray-100 dark:bg-black/40'
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {errorMessage && (
              <div className='border-destructive flex items-start gap-x-2 rounded-lg border px-4 py-3 pb-2'>
                <AlertCircleIcon className='text-destructive size-4' />{' '}
                <span className='text-destructive translate-y-[-0.18rem]'>
                  {errorMessage}
                </span>
              </div>
            )}

            <Button
              type='submit'
              size='lg'
              className='mx-auto block text-white'
              disabled={isPending}
            >
              {isPending ? 'Loading...' : 'Login'}
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
}

function ThemeToggler() {
  const { theme, setTheme } = useTheme();

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  return (
    <button
      type='button'
      onClick={toggleTheme}
      className='absolute right-2 top-2 z-[1]'
    >
      <span className='sr-only'>toggle theme</span>
      {theme === 'dark' ? <Moon className='text-white' /> : <Sun />}
    </button>
  );
}
