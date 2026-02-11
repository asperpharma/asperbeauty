/**
 * [FormName] Form Component
 * 
 * @description Form component with validation using React Hook Form + Zod
 * @example
 * ```tsx
 * <FormName onSubmit={handleSubmit} />
 * ```
 */

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useLanguage } from "@/contexts/LanguageContext";
import { toast } from "sonner";

/**
 * Form validation schema using Zod
 */
const formSchema = z.object({
  name: z.string()
    .min(2, { message: "Name must be at least 2 characters" })
    .max(50, { message: "Name must be less than 50 characters" }),
  
  email: z.string()
    .email({ message: "Please enter a valid email address" }),
  
  phone: z.string()
    .regex(/^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/, {
      message: "Please enter a valid phone number"
    })
    .optional()
    .or(z.literal("")),
  
  message: z.string()
    .min(10, { message: "Message must be at least 10 characters" })
    .max(500, { message: "Message must be less than 500 characters" }),
  
  agreeToTerms: z.boolean()
    .refine((val) => val === true, {
      message: "You must agree to the terms and conditions"
    }),
});

/**
 * Infer TypeScript type from schema
 */
type FormValues = z.infer<typeof formSchema>;

/**
 * Props for the form component
 */
interface FormNameProps {
  /**
   * Callback when form is submitted successfully
   */
  onSubmit: (data: FormValues) => void | Promise<void>;
  
  /**
   * Initial form values (for edit mode)
   */
  initialValues?: Partial<FormValues>;
  
  /**
   * Whether the form is in loading state
   */
  isLoading?: boolean;
}

/**
 * Form component implementation
 */
export const FormName = ({ 
  onSubmit, 
  initialValues,
  isLoading = false 
}: FormNameProps) => {
  const { language } = useLanguage();

  // Initialize form with React Hook Form
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: initialValues?.name || "",
      email: initialValues?.email || "",
      phone: initialValues?.phone || "",
      message: initialValues?.message || "",
      agreeToTerms: initialValues?.agreeToTerms || false,
    },
  });

  // Handle form submission
  const handleSubmit = async (data: FormValues) => {
    try {
      await onSubmit(data);
      
      toast.success(
        language === 'ar' 
          ? 'تم إرسال النموذج بنجاح!' 
          : 'Form submitted successfully!',
        {
          position: "top-center",
        }
      );
      
      // Reset form after successful submission
      form.reset();
    } catch (error) {
      toast.error(
        language === 'ar' 
          ? 'حدث خطأ أثناء إرسال النموذج' 
          : 'Error submitting form',
        {
          description: error instanceof Error ? error.message : undefined,
          position: "top-center",
        }
      );
    }
  };

  return (
    <Form {...form}>
      <form 
        onSubmit={form.handleSubmit(handleSubmit)} 
        className="space-y-6"
      >
        {/* Name Field */}
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="font-body text-foreground">
                {language === 'ar' ? 'الاسم' : 'Name'}
              </FormLabel>
              <FormControl>
                <Input 
                  placeholder={language === 'ar' ? 'أدخل اسمك' : 'Enter your name'}
                  {...field}
                  disabled={isLoading}
                  className="font-body"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Email Field */}
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="font-body text-foreground">
                {language === 'ar' ? 'البريد الإلكتروني' : 'Email'}
              </FormLabel>
              <FormControl>
                <Input 
                  type="email"
                  placeholder={language === 'ar' ? 'أدخل بريدك الإلكتروني' : 'Enter your email'}
                  {...field}
                  disabled={isLoading}
                  className="font-body"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Phone Field (Optional) */}
        <FormField
          control={form.control}
          name="phone"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="font-body text-foreground">
                {language === 'ar' ? 'رقم الهاتف' : 'Phone'} 
                <span className="text-muted-foreground text-sm ms-1">
                  ({language === 'ar' ? 'اختياري' : 'Optional'})
                </span>
              </FormLabel>
              <FormControl>
                <Input 
                  type="tel"
                  placeholder={language === 'ar' ? '+966 XX XXX XXXX' : '+966 XX XXX XXXX'}
                  {...field}
                  disabled={isLoading}
                  className="font-body"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Message Field */}
        <FormField
          control={form.control}
          name="message"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="font-body text-foreground">
                {language === 'ar' ? 'الرسالة' : 'Message'}
              </FormLabel>
              <FormControl>
                <Textarea 
                  placeholder={language === 'ar' ? 'اكتب رسالتك هنا' : 'Write your message here'}
                  rows={5}
                  {...field}
                  disabled={isLoading}
                  className="font-body resize-none"
                />
              </FormControl>
              <FormDescription className="font-body text-xs text-muted-foreground">
                {language === 'ar' 
                  ? 'يرجى تقديم تفاصيل كافية' 
                  : 'Please provide sufficient details'
                }
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Terms Checkbox */}
        <FormField
          control={form.control}
          name="agreeToTerms"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start space-x-3 space-y-0">
              <FormControl>
                <input
                  type="checkbox"
                  checked={field.value}
                  onChange={field.onChange}
                  disabled={isLoading}
                  className="mt-1"
                />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel className="font-body text-sm">
                  {language === 'ar' 
                    ? 'أوافق على الشروط والأحكام' 
                    : 'I agree to the terms and conditions'
                  }
                </FormLabel>
                <FormMessage />
              </div>
            </FormItem>
          )}
        />

        {/* Submit Button */}
        <Button 
          type="submit" 
          className="w-full bg-burgundy text-white hover:bg-burgundy-light font-body tracking-wide"
          disabled={isLoading}
        >
          {isLoading 
            ? (language === 'ar' ? 'جارٍ الإرسال...' : 'Submitting...')
            : (language === 'ar' ? 'إرسال' : 'Submit')
          }
        </Button>
      </form>
    </Form>
  );
};

export default FormName;

// Example usage:
// const handleFormSubmit = async (data: FormValues) => {
//   // Process form data
//   console.log(data);
//   // await api.submitForm(data);
// };
//
// <FormName 
//   onSubmit={handleFormSubmit}
//   isLoading={false}
// />
