import emailjs from "@emailjs/browser";

/**
 * Send email using EmailJS
 * 
 * @param variables - key/value pairs matching your template fields
 */
export const sendEmail = async (variables: Record<string, any>) => {
  const serviceId = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID!;
  const templateId = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID!;
  const publicKey = process.env.NEXT_PUBLIC_EMAILJS_USER_ID!;

  if (!serviceId || !templateId || !publicKey) {
    throw new Error("❌ Missing EmailJS environment variables");
  }

  try {
    const response = await emailjs.send(serviceId, templateId, variables, publicKey);
    console.log("✅ Email sent:", response.status, response.text);
    return response;
  } catch (error) {
    console.error("❌ Email send failed:", error);
    throw error;
  }
};
