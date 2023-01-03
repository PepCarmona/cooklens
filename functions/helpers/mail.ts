import nodemailer from 'nodemailer';
import { UserInfo } from '../../types';

interface SimpleMailOptions {
  to: string;
  subject?: string;
  html: string;
}
const transport = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 465,
  secure: true,
  auth: {
    user: process.env.GMAIL_USER!,
    pass: process.env.GMAIL_API_PASS!,
  },
});

transport
  .verify()
  .then(() => console.log('Nodemailer ready'))
  .catch((err) => console.log('Error setting up Nodemailer', err));

function sendMail(options: SimpleMailOptions) {
  return transport.sendMail({
    from: `"Cooklens" <${process.env.GMAIL_USER}>`,
    to: options.to,
    subject: options.subject ?? 'Cooklens Info',
    html: options.html,
  });
}

export function sendConfirmationMail<T extends Omit<UserInfo, '_id'>>(
  user: T,
  host: string
) {
  const confirmationUrl = new URL(host + '/auth');
  confirmationUrl.searchParams.append('code', user.confirmationCode);

  return sendMail({
    to: user.email,
    subject: 'Verify your account',
    html: `
		<div style="
			background-image: url('https://images.unsplash.com/photo-1512621776951-a57141f2eefd?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=870&q=80');
			background-position: center;
			background-size: cover;
			padding-bottom: 40px;
		">
			<div style="
				background: linear-gradient(0deg,transparent 0%,#00000070 100%);
				color: white;
				padding: 20px;
				padding-bottom: 100px;
				text-align: center;
			">
				<span style="
					font-size: 50px;
				">
					Cooklens
				</span>
				<br/>
				<span style="
					font-size: 20px;
				">
					Great things await us!!
				</span>
			</div>
			<div style="
				width: 50%;
				min-width: 200px;
				max-width: 500px;
				background-color: #00000045;
				border-radius: 10px;
				margin-left: auto;
				margin-right: auto;
				padding: 20px;
				font-size: 16px;
				color: #F2F3F4;
				box-shadow: 0 0 10px 1px #00000045;
				backdrop-filter: blur(5px);
			">
				<div>
					<p>
						Hello ${user.username}, <br/><br/>
						We are glad to see you joining our community. <br/>
						You are just a step away from being part of this amazing network!
					</p>
					<br/>
					<a 
						href="${confirmationUrl}"
						style="
							display: block;
							background-color: #12B886;
							color: white;
							text-decoration: none;
							padding: 8px 20px;
							border-radius: 10px;
							width: fit-content;
						"
					>
						Confirm email address
					</a>
				</div>
			</div>
		</div>
		`,
  });
}

export function sendPasswordRecoveryMail<
  T extends Omit<UserInfo, '_id'> & { recoveryToken: string }
>(user: T, host: string) {
  const recoveryUrl = new URL(host + '/auth/recover');
  recoveryUrl.searchParams.append('token', user.recoveryToken);
  recoveryUrl.searchParams.append('mail', user.email);

  return sendMail({
    to: user.email,
    subject: 'Recover your password',
    html: `
		<div style="
			background-image: url('https://images.unsplash.com/photo-1512621776951-a57141f2eefd?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=870&q=80');
			background-position: center;
			background-size: cover;
			padding-bottom: 40px;
		">
			<div style="
				background: linear-gradient(0deg,transparent 0%,#00000070 100%);
				color: white;
				padding: 20px;
				padding-bottom: 100px;
				text-align: center;
			">
				<span style="
					font-size: 50px;
				">
					Cooklens
				</span>
				<br/>
				<span style="
					font-size: 20px;
				">
					Great things await us!!
				</span>
			</div>
			<div style="
				width: 50%;
				min-width: 200px;
				max-width: 500px;
				background-color: #00000045;
				border-radius: 10px;
				margin-left: auto;
				margin-right: auto;
				padding: 20px;
				font-size: 16px;
				color: #F2F3F4;
				box-shadow: 0 0 10px 1px #00000045;
				backdrop-filter: blur(5px);
			">
				<div>
					<p>
						Hello ${user.username}, <br/><br/>
						We have received a request to reset your password. <br/>
						The next link will allow you to set a new password.
					</p>
					<br/>
					<a 
						href="${recoveryUrl}"
						style="
							display: block;
							background-color: #12B886;
							color: white;
							text-decoration: none;
							padding: 8px 20px;
							border-radius: 10px;
							width: fit-content;
						"
					>
						Recover your password
					</a>
				</div>
			</div>
		</div>
		`,
  });
}
