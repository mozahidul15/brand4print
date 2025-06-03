import nodemailer from 'nodemailer';

// Email configuration
const createTransporter = () => {
    // For development, you can use a service like Gmail or a testing service like Ethereal
    // For production, configure with your actual SMTP settings
    return nodemailer.createTransport({
        host: process.env.SMTP_HOST || 'smtp.gmail.com',
        port: parseInt(process.env.SMTP_PORT || '587'),
        secure: false, // true for 465, false for other ports
        auth: {
            user: process.env.SMTP_USER, // Your email address
            pass: process.env.SMTP_PASS, // Your email password or app-specific password
        },
    });
};

interface RevisionEmailData {
    customerName: string;
    customerEmail: string;
    orderNumber: string;
    artworkIssues: string;
}

export const sendRevisionRequiredEmail = async (data: RevisionEmailData) => {
    const transporter = createTransporter();

    const emailTemplate = `
    <div style="max-width: 600px; margin: 0 auto; font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
      <div style="background: linear-gradient(135deg, #7000fe 0%, #9c40ff 100%); padding: 40px 20px; text-align: center; color: white;">
        <h1 style="margin: 0; font-size: 28px; font-weight: bold;">Brand4Print</h1>
        <p style="margin: 10px 0 0 0; font-size: 16px; opacity: 0.9;">Professional Printing Services</p>
      </div>
      
      <div style="padding: 40px 30px; background: #ffffff;">
        <h2 style="color: #7000fe; margin-bottom: 20px; font-size: 24px;">Artwork Revision Required</h2>
        
        <p style="margin-bottom: 20px; font-size: 16px;">Dear ${data.customerName},</p>
        
        <p style="margin-bottom: 20px; font-size: 16px;">
          Thank you for your order <strong>#${data.orderNumber}</strong>. Our design team has reviewed your artwork and we need to discuss some revisions to ensure the best possible print quality.
        </p>
        
        <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #7000fe;">
          <h3 style="margin-top: 0; color: #7000fe; font-size: 18px;">Revision Details:</h3>
          <p style="margin-bottom: 0; font-size: 16px;">${data.artworkIssues}</p>
        </div>
        
        <div style="background: #e8f5e8; padding: 25px; border-radius: 8px; margin: 30px 0; border: 1px solid #d4edda;">
          <h3 style="margin-top: 0; color: #155724; font-size: 20px;">🎨 Professional Vectorization Service</h3>
          <p style="margin-bottom: 15px; font-size: 16px; color: #155724;">
            To ensure your artwork meets our high-quality printing standards, we offer professional vectorization services:
          </p>
          
          <div style="display: flex; gap: 20px; margin: 20px 0; flex-wrap: wrap;">
            <div style="flex: 1; min-width: 200px; background: white; padding: 20px; border-radius: 6px; border: 1px solid #c3e6cb;">
              <h4 style="margin-top: 0; color: #155724; font-size: 18px;">1-Colour Design</h4>
              <p style="font-size: 24px; font-weight: bold; color: #7000fe; margin: 10px 0;">£30</p>
              <p style="margin-bottom: 0; font-size: 14px; color: #6c757d;">Perfect for simple logos and text</p>
            </div>
            
            <div style="flex: 1; min-width: 200px; background: white; padding: 20px; border-radius: 6px; border: 1px solid #c3e6cb;">
              <h4 style="margin-top: 0; color: #155724; font-size: 18px;">2-Colour Design</h4>
              <p style="font-size: 24px; font-weight: bold; color: #7000fe; margin: 10px 0;">£50</p>
              <p style="margin-bottom: 0; font-size: 14px; color: #6c757d;">Ideal for multi-colour artwork</p>
            </div>
          </div>
          
          <p style="margin-bottom: 0; font-size: 14px; color: #6c757d; font-style: italic;">
            ✨ Our vectorization service includes color optimization, resolution enhancement, and print-ready formatting.
          </p>
        </div>
        
        <div style="margin: 30px 0;">
          <h3 style="color: #7000fe; font-size: 18px;">How would you like to proceed?</h3>
          <ul style="padding-left: 20px; font-size: 16px; line-height: 1.8;">
            <li><strong>Option 1:</strong> Proceed with our vectorization service (£30 for 1-colour, £50 for 2-colour)</li>
            <li><strong>Option 2:</strong> Provide revised artwork that meets our specifications</li>
            <li><strong>Option 3:</strong> Contact us to discuss alternative solutions</li>
          </ul>
        </div>
        
        <div style="text-align: center; margin: 30px 0;">
          <a href="mailto:info@brand4print.co.uk?subject=Order ${data.orderNumber} - Artwork Revision Response" 
             style="background: #7000fe; color: white; padding: 15px 30px; text-decoration: none; border-radius: 6px; font-size: 16px; font-weight: bold; display: inline-block;">
            Reply to This Email
          </a>
        </div>
        
        <p style="margin-bottom: 20px; font-size: 16px;">
          Please reply to this email with your preferred option, and we'll get your order processed quickly.
        </p>
        
        <p style="margin-bottom: 0; font-size: 16px;">
          Thank you for choosing Brand4Print!<br>
          <strong>The Brand4Print Team</strong>
        </p>
      </div>
      
      <div style="background: #f8f9fa; padding: 20px 30px; text-align: center; border-top: 1px solid #e9ecef;">
        <p style="margin: 0; font-size: 14px; color: #6c757d;">
          Brand4Print | Professional Printing Services<br>
          Email: info@brand4print.co.uk | Website: brand4print.co.uk
        </p>
      </div>
    </div>
  `;

    const mailOptions = {
        from: process.env.SMTP_USER || 'noreply@brand4print.co.uk',
        to: data.customerEmail,
        // to: "mh67705251@gmail.com",
        subject: `Order ${data.orderNumber} - Artwork Revision Required | Brand4Print`,
        html: emailTemplate,
    };

    try {
        const result = await transporter.sendMail(mailOptions);
        console.log('Email sent successfully:', result.messageId);
        return { success: true, messageId: result.messageId };
    } catch (error) {
        console.error('Error sending email:', error);
        throw new Error('Failed to send email');
    }
};
