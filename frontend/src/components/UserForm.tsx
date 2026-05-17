import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import axios from 'axios';
import { useState } from 'react';
import { UserPlus, AlertCircle } from 'lucide-react';

const API_BASE_URL = 'http://localhost:8000';

// Strict Government Level Validation
const userSchema = z.object({
  first_name: z.string()
    .min(2, "First name must be at least 2 characters")
    .max(50, "First name too long")
    .regex(/^[a-zA-Z\s]+$/, "Only letters allowed in name"),

  last_name: z.string()
    .min(2, "Last name must be at least 2 characters")
    .max(50, "Last name too long")
    .regex(/^[a-zA-Z\s]+$/, "Only letters allowed in name"),

  email: z.string()
    .email("Please enter a valid email address")
    .max(100, "Email too long"),

  gender: z.enum(["Male", "Female", "Other"], { 
    required_error: "Please select gender" 
  }),

  // Strict Indian Phone Number (10 digits only)
  phone_number: z.string()
    .length(10, "Phone number must be exactly 10 digits")
    .regex(/^[6-9]\d{9}$/, "Must be valid Indian mobile number (starts with 6-9)"),
});

type UserFormData = z.infer<typeof userSchema>;

interface UserFormProps {
  onSuccess: () => void;
}

export function UserForm({ onSuccess }: UserFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  const { register, handleSubmit, reset, formState: { errors } } = useForm<UserFormData>({
    resolver: zodResolver(userSchema),
    mode: "onChange"   // Real-time validation
  });

  const onSubmit = async (data: UserFormData) => {
    setIsLoading(true);
    setMessage(null);

    try {
      await axios.post(`${API_BASE_URL}/users`, data);
      setMessage({ type: 'success', text: 'Citizen record saved successfully! ✅' });
      reset();
      onSuccess();
    } catch (error: any) {
      const errorMsg = error.response?.data?.detail || "Failed to save record";
      setMessage({ type: 'error', text: errorMsg });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl p-8 sticky top-8">
      <div className="flex items-center gap-3 mb-6">
        <UserPlus className="w-7 h-7 text-blue-600" />
        <h3 className="text-2xl font-semibold text-gray-800">Add New Citizen</h3>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        {/* First Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">First Name *</label>
          <input {...register("first_name")} className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500" placeholder="Enter first name" />
          {errors.first_name && <p className="text-red-500 text-sm mt-1 flex items-center gap-1"><AlertCircle size={14}/> {errors.first_name.message}</p>}
        </div>

        {/* Last Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Last Name *</label>
          <input {...register("last_name")} className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500" placeholder="Enter last name" />
          {errors.last_name && <p className="text-red-500 text-sm mt-1 flex items-center gap-1"><AlertCircle size={14}/> {errors.last_name.message}</p>}
        </div>

        {/* Email */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Email Address *</label>
          <input type="email" {...register("email")} className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500" placeholder="example@email.com" />
          {errors.email && <p className="text-red-500 text-sm mt-1 flex items-center gap-1"><AlertCircle size={14}/> {errors.email.message}</p>}
        </div>

        {/* Gender */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Gender *</label>
          <select {...register("gender")} className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500">
            <option value="">Select Gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>
          {errors.gender && <p className="text-red-500 text-sm mt-1 flex items-center gap-1"><AlertCircle size={14}/> {errors.gender.message}</p>}
        </div>

        {/* Phone Number - Strict 10 digits */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Mobile Number (10 digits) *</label>
          <input 
            {...register("phone_number")} 
            maxLength={10}
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500" 
            placeholder="9876543210" 
          />
          {errors.phone_number && <p className="text-red-500 text-sm mt-1 flex items-center gap-1"><AlertCircle size={14}/> {errors.phone_number.message}</p>}
          <p className="text-xs text-gray-500 mt-1">Must be 10 digits starting with 6-9</p>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold py-4 rounded-xl transition-all text-lg shadow-md"
        >
          {isLoading ? "Saving Record..." : "Save Citizen Record"}
        </button>
      </form>

      {message && (
        <div className={`mt-5 p-4 rounded-xl flex items-start gap-3 ${message.type === 'success' ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>
          <AlertCircle className="mt-0.5" size={20} />
          {message.text}
        </div>
      )}
    </div>
  );
}