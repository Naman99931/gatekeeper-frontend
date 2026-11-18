import z from "zod";

const base = z.object({
  username: z.string().min(1, 'Username is required').max(50),
  email: z.string().email('Enter a valid email'),
  role: z.string().min(1, 'Role is required'), // no more z.enum(ROLES)
  enabled: z.boolean().default(true),
});
