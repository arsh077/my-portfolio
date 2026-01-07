# Contact Form Setup Guide

The portfolio includes a contact form that needs a backend service to handle submissions. Here are several options:

## 🚀 Quick Setup Options

### 1. Formspree (Recommended for beginners)

**Pros**: Easy setup, free tier, spam protection
**Cons**: Limited customization

**Setup**:
1. Go to [formspree.io](https://formspree.io)
2. Create an account and get your form endpoint
3. Update the form action in `App.tsx`:

```tsx
<form action="https://formspree.io/f/YOUR_FORM_ID" method="POST" className="space-y-6 mt-8">
```

### 2. Netlify Forms

**Pros**: Integrated with Netlify hosting, free tier
**Cons**: Only works with Netlify hosting

**Setup**:
1. Deploy to Netlify
2. Add `netlify` attribute to your form:

```tsx
<form netlify name="contact" className="space-y-6 mt-8">
  <input type="hidden" name="form-name" value="contact" />
  {/* rest of your form fields */}
</form>
```

### 3. EmailJS

**Pros**: Client-side only, no backend needed
**Cons**: API keys exposed in frontend

**Setup**:
1. Install EmailJS: `npm install @emailjs/browser`
2. Create account at [emailjs.com](https://emailjs.com)
3. Update your form component:

```tsx
import emailjs from '@emailjs/browser';

const sendEmail = (e: React.FormEvent) => {
  e.preventDefault();
  
  emailjs.sendForm('YOUR_SERVICE_ID', 'YOUR_TEMPLATE_ID', e.target, 'YOUR_PUBLIC_KEY')
    .then((result) => {
      console.log(result.text);
      // Show success message
    }, (error) => {
      console.log(error.text);
      // Show error message
    });
};
```

## 🔧 Advanced Setup (Custom Backend)

### Node.js + Express Backend

Create a simple backend to handle form submissions:

```javascript
// server.js
const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const transporter = nodemailer.createTransporter({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

app.post('/api/contact', async (req, res) => {
  const { name, email, service, message } = req.body;
  
  const mailOptions = {
    from: email,
    to: 'arshad@legalsuccess.in',
    subject: `New Contact Form Submission - ${service}`,
    html: `
      <h3>New Contact Form Submission</h3>
      <p><strong>Name:</strong> ${name}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Service:</strong> ${service}</p>
      <p><strong>Message:</strong> ${message}</p>
    `
  };
  
  try {
    await transporter.sendMail(mailOptions);
    res.status(200).json({ message: 'Email sent successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to send email' });
  }
});

app.listen(3001, () => {
  console.log('Server running on port 3001');
});
```

### Python Flask Backend

```python
# app.py
from flask import Flask, request, jsonify
from flask_cors import CORS
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
import os

app = Flask(__name__)
CORS(app)

@app.route('/api/contact', methods=['POST'])
def contact():
    data = request.json
    
    # Email configuration
    smtp_server = "smtp.gmail.com"
    smtp_port = 587
    sender_email = os.getenv('EMAIL_USER')
    sender_password = os.getenv('EMAIL_PASS')
    
    # Create message
    message = MIMEMultipart()
    message["From"] = sender_email
    message["To"] = "arshad@legalsuccess.in"
    message["Subject"] = f"New Contact Form - {data['service']}"
    
    body = f"""
    New Contact Form Submission:
    
    Name: {data['name']}
    Email: {data['email']}
    Service: {data['service']}
    Message: {data['message']}
    """
    
    message.attach(MIMEText(body, "plain"))
    
    try:
        server = smtplib.SMTP(smtp_server, smtp_port)
        server.starttls()
        server.login(sender_email, sender_password)
        server.sendmail(sender_email, "arshad@legalsuccess.in", message.as_string())
        server.quit()
        
        return jsonify({"message": "Email sent successfully"}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)
```

## 📱 Frontend Form Handler

Update your React form to handle submissions:

```tsx
const [formStatus, setFormStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
  e.preventDefault();
  setFormStatus('loading');
  
  const formData = new FormData(e.currentTarget);
  const data = {
    name: formData.get('name'),
    email: formData.get('email'),
    service: formData.get('service'),
    message: formData.get('message')
  };
  
  try {
    const response = await fetch('/api/contact', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data)
    });
    
    if (response.ok) {
      setFormStatus('success');
      e.currentTarget.reset();
    } else {
      setFormStatus('error');
    }
  } catch (error) {
    setFormStatus('error');
  }
};

// In your JSX:
<form onSubmit={handleSubmit} className="space-y-6 mt-8">
  {/* form fields */}
  <Button 
    type="submit" 
    disabled={formStatus === 'loading'}
    className="w-full py-4 text-lg bg-[#C3E41D] text-black hover:bg-[#b2d11b] disabled:opacity-50"
  >
    {formStatus === 'loading' ? 'Sending...' : 'Send Message'}
  </Button>
  
  {formStatus === 'success' && (
    <p className="text-green-600 text-center">Message sent successfully!</p>
  )}
  
  {formStatus === 'error' && (
    <p className="text-red-600 text-center">Failed to send message. Please try again.</p>
  )}
</form>
```

## 🔒 Security Considerations

### Spam Protection
- Add reCAPTCHA v3
- Implement rate limiting
- Use honeypot fields
- Validate email formats

### Data Protection
- Sanitize all inputs
- Use HTTPS only
- Don't store sensitive data
- Implement GDPR compliance

## 📊 Analytics Integration

Track form submissions:

```tsx
// Google Analytics 4
gtag('event', 'form_submit', {
  event_category: 'Contact',
  event_label: service,
});

// Custom analytics
analytics.track('Contact Form Submitted', {
  service: service,
  timestamp: new Date().toISOString()
});
```

## 🎯 Recommended Approach

For your portfolio, I recommend starting with **Formspree** for simplicity:

1. Quick setup (5 minutes)
2. Free tier sufficient for portfolio
3. Built-in spam protection
4. No backend maintenance
5. Easy to upgrade later

Once you have more traffic or specific requirements, you can migrate to a custom backend solution.

Choose the option that best fits your technical comfort level and hosting setup!