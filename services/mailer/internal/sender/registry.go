package sender

type EmailMeta struct {
	Subject      string
	TemplateFile string
}

var EmailRegistry = map[string]EmailMeta{
	"verify_email": {
		Subject:      "Подтверждение регистрации",
		TemplateFile: "verify_email.html",
	},
	"change_email": {
		Subject:      "Подтверждение смены Email адреса",
		TemplateFile: "change_email.html",
	},
	"change_password": {
		Subject:      "Подтверждение смены пароля",
		TemplateFile: "change_password.html",
	},
}
