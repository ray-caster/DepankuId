# 📧 Brevo Email Service Setup Guide

This guide will walk you through setting up Brevo (formerly Sendinblue) for email verification and transactional emails in your Depanku.id project.

## 📋 Table of Contents

1. [What is Brevo?](#what-is-brevo)
2. [Creating a Brevo Account](#creating-a-brevo-account)
3. [Getting Your API Key](#getting-your-api-key)
4. [Configuring Your Domain](#configuring-your-domain)
5. [Setting Up Environment Variables](#setting-up-environment-variables)
6. [Testing Email Functionality](#testing-email-functionality)
7. [Troubleshooting](#troubleshooting)

## 🌟 What is Brevo?

Brevo is an email service provider that offers:
- **Transactional emails** (verification, notifications, etc.)
- **Marketing emails** (newsletters, campaigns)
- **SMS messaging**
- **Free tier** with 300 emails/day
- **Reliable delivery** and detailed analytics

## 🚀 Creating a Brevo Account

### Step 1: Sign Up
1. Go to [brevo.com](https://www.brevo.com)
2. Click **"Get started for free"**
3. Fill in your details:
   - Email address
   - Password
   - Company name (optional)
4. Verify your email address

### Step 2: Complete Profile Setup
1. Choose your industry
2. Select your use case (Transactional emails)
3. Provide contact information
4. Accept terms and conditions

### Step 3: Account Verification
- Check your email for verification link
- Complete any additional verification steps if prompted

## 🔑 Getting Your API Key

### Step 1: Access SMTP & API Section
1. Log into your Brevo dashboard
2. Navigate to **Settings** → **SMTP & API**
3. Click on the **"API Keys"** tab

### Step 2: Create API Key
1. Click **"Create a new API key"**
2. Give it a name: `Depanku.id Production` (or similar)
3. Select permissions:
   - ✅ **Send emails**
   - ✅ **Get account information**
4. Click **"Generate"**

### Step 3: Save Your API Key
⚠️ **IMPORTANT:** Copy and save your API key immediately. You won't be able to see it again!

Your API key will look like: `xkeys-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx`

## 🌐 Configuring Your Domain

### Step 1: Add Your Domain
1. Go to **Settings** → **Domains**
2. Click **"Add a domain"**
3. Enter your domain: `depanku.id` (or your custom domain)
4. Click **"Add domain"**

### Step 2: Verify Domain Ownership
1. Brevo will provide DNS records to add
2. Add these records to your domain's DNS settings:
   - **TXT record** for domain verification
   - **CNAME record** for DKIM authentication
   - **MX record** for email routing (if needed)

### Step 3: Wait for Verification
- Domain verification can take 24-48 hours
- Check status in the Brevo dashboard
- You'll receive an email when verified

## ⚙️ Setting Up Environment Variables

### Step 1: Create Environment File
Create a `.env.local` file in your project root:

```bash
# Brevo Configuration
BREVO_API_KEY=xkeys-your-api-key-here
BREVO_SENDER_EMAIL=noreply@depanku.id
BREVO_SENDER_NAME=Depanku.id

# Frontend URL (for email links)
FRONTEND_URL=http://localhost:1000
```

### Step 2: Backend Environment Variables
In your backend directory, create a `.env` file:

```bash
# Brevo Configuration
BREVO_API_KEY=xkeys-your-api-key-here

# Frontend URL
FRONTEND_URL=http://localhost:1000
```

### Step 3: Update Your Code
The backend code is already configured to use these environment variables:

```python
# In backend/app.py
BREVO_API_KEY = os.getenv("BREVO_API_KEY")
```

## 📧 Email Templates

### Current Email Types in Your Project

#### 1. Email Verification
- **Triggered:** When user signs up
- **Purpose:** Verify email address
- **Template:** HTML email with verification link

#### 2. Password Reset (Future)
- **Triggered:** When user requests password reset
- **Purpose:** Allow secure password change
- **Template:** HTML email with reset link

### Customizing Email Templates

You can customize the email templates in `backend/app.py`:

```python
# Email verification template
html_content = f"""
<html>
<body style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
    <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); 
                padding: 30px; border-radius: 10px; color: white; text-align: center;">
        <h1 style="margin: 0;">✨ Welcome to Depanku.id!</h1>
    </div>
    
    <div style="padding: 30px; background: #f9fafb; border-radius: 10px; margin-top: 20px;">
        <p>Hi {name},</p>
        <p>Thank you for joining Depanku.id! Please verify your email address.</p>
        
        <div style="text-align: center; margin: 30px 0;">
            <a href="{verification_link}" 
               style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); 
                      color: white; padding: 15px 40px; text-decoration: none; 
                      border-radius: 8px; font-weight: bold; display: inline-block;">
                Verify Email Address
            </a>
        </div>
    </div>
</body>
</html>
"""
```

## 🧪 Testing Email Functionality

### Step 1: Test Email Sending
1. Start your backend server:
   ```bash
   cd backend
   python app.py
   ```

2. Try signing up with a test email address
3. Check your email inbox for the verification email
4. Check Brevo dashboard for delivery statistics

### Step 2: Check Brevo Dashboard
1. Go to **Email** → **Statistics**
2. Look for your test emails
3. Check delivery status and any errors

### Step 3: Test Email Links
1. Click the verification link in the email
2. Ensure it redirects to your frontend
3. Verify the account activation works

## 🔧 Troubleshooting

### Common Issues

#### 1. "Invalid API Key" Error
**Solution:**
- Double-check your API key in environment variables
- Ensure no extra spaces or characters
- Regenerate API key if needed

#### 2. "Domain not verified" Error
**Solution:**
- Complete domain verification in Brevo dashboard
- Check DNS records are correctly set
- Wait for DNS propagation (up to 48 hours)

#### 3. Emails going to spam
**Solution:**
- Set up SPF, DKIM, and DMARC records
- Use a verified domain
- Avoid spam trigger words in email content
- Warm up your domain with gradual email sending

#### 4. "Sender email not verified" Error
**Solution:**
- Verify your sender email in Brevo
- Use an email from your verified domain
- Check sender reputation

### Debug Mode

Add logging to your backend for debugging:

```python
import logging

# Add this to your email sending function
try:
    brevo_api_instance.send_transac_email(send_smtp_email)
    print("✅ Email sent successfully")
except Exception as e:
    print(f"❌ Email sending failed: {str(e)}")
    logging.error(f"Brevo email error: {str(e)}")
```

## 📊 Monitoring and Analytics

### Brevo Dashboard Features
1. **Email Statistics**
   - Delivery rates
   - Open rates
   - Click rates
   - Bounce rates

2. **Real-time Monitoring**
   - Live delivery status
   - Error tracking
   - Performance metrics

3. **Contact Management**
   - Email lists
   - Unsubscribe tracking
   - Contact segmentation

## 🚀 Production Deployment

### For Production Environment

1. **Update Environment Variables:**
   ```bash
   # Production .env
   BREVO_API_KEY=xkeys-your-production-api-key
   FRONTEND_URL=https://depanku.id
   ```

2. **Use Production Domain:**
   - Verify your production domain in Brevo
   - Update sender email to use your domain
   - Set up proper DNS records

3. **Monitor Email Deliverability:**
   - Check bounce rates
   - Monitor spam complaints
   - Track delivery statistics

## 📚 Additional Resources

- [Brevo API Documentation](https://developers.brevo.com/)
- [Brevo SMTP Settings](https://help.brevo.com/hc/en-us/articles/209467485)
- [Email Deliverability Best Practices](https://help.brevo.com/hc/en-us/articles/209467485)
- [Brevo Status Page](https://status.brevo.com/)

## ✅ Checklist

- [ ] Brevo account created and verified
- [ ] API key generated and saved
- [ ] Domain added and verified
- [ ] Environment variables configured
- [ ] Email templates customized
- [ ] Test emails sent successfully
- [ ] Email verification working
- [ ] Production domain configured (for deployment)

---

**Need Help?** Check the [troubleshooting section](#troubleshooting) or refer to the [Brevo documentation](https://help.brevo.com/).
