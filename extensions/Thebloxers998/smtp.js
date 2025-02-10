(function(Scratch) {
    'use strict';

    const ArgumentType = Scratch.ArgumentType;
    const BlockType = Scratch.BlockType;
    const Cast = Scratch.Cast;

    class SMTP {
        constructor() {
            this.smtpConfig = {};
        }

        getInfo() {
            return {
                id: 'smtp',
                name: 'SMTP',
                blocks: [
                    {
                        opcode: 'setSMTPConfig',
                        blockType: BlockType.COMMAND,
                        text: 'set SMTP host to [HOST] port to [PORT] username to [USERNAME] and password to [PASSWORD]',
                        arguments: {
                            HOST: {
                                type: ArgumentType.STRING,
                                defaultValue: 'smtp.example.com'
                            },
                            PORT: {
                                type: ArgumentType.NUMBER,
                                defaultValue: 587 // Common port for SMTP
                            },
                            USERNAME: {
                                type: ArgumentType.STRING,
                                defaultValue: 'your-email@example.com'
                            },
                            PASSWORD: {
                                type: ArgumentType.STRING,
                                defaultValue: 'your-email-password'
                            }
                        }
                    },
                    {
                        opcode: 'sendEmail',
                        blockType: BlockType.COMMAND,
                        text: 'send email to [TO] with subject [SUBJECT] and body [BODY]',
                        arguments: {
                            TO: {
                                type: ArgumentType.STRING,
                                defaultValue: 'recipient@example.com'
                            },
                            SUBJECT: {
                                type: ArgumentType.STRING,
                                defaultValue: 'Hello'
                            },
                            BODY: {
                                type: ArgumentType.STRING,
                                defaultValue: 'This is a test email.'
                            }
                        }
                    }
                ]
            };
        }

        setSMTPConfig(args) {
            this.smtpConfig = {
                host: args.HOST,
                port: args.PORT,
                username: args.USERNAME,
                password: args.PASSWORD
            };
            console.log('SMTP configuration set:', this.smtpConfig);
        }

        async sendEmail(args) {
            const response = await fetch(`smtp://${this.smtpConfig.host}:${this.smtpConfig.port}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Basic ' + btoa(`${this.smtpConfig.username}:${this.smtpConfig.password}`)
                },
                body: JSON.stringify({
                    to: args.TO,
                    subject: args.SUBJECT,
                    body: args.BODY
                })
            });

            if (response.ok) {
                console.log(`Email sent to ${args.TO}`);
            } else {
                console.error('Failed to send email');
            }
        }
    }

    Scratch.extensions.register(new SMTP());
})(Scratch);
