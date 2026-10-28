# Appium + Selenium mobile starter

Starter Java para a trilha. Usa o Appium Java Client e APIs Selenium/WebDriver para abrir um app Android de teste e validar um elemento por accessibility id.

## Pré-requisitos

- Java 17+
- Maven 3.9+
- Android SDK e um emulador iniciado ou device Android de QA conectado
- Appium 3 e driver UiAutomator2 compatível
- Um APK próprio, de demonstração ou autorizado para teste

O client e Selenium estão fixados em versões compatíveis no `pom.xml`. Confira a matriz oficial antes de atualizar um deles. iOS exige macOS e o driver XCUITest.

## Preparar o ambiente

```bash
npm install --global appium
appium driver install uiautomator2
appium
```

Em outro terminal:

```bash
adb devices
```

O dispositivo precisa aparecer como `device`, não `offline` ou `unauthorized`.

## Executar

Configure o caminho para o APK e o accessibility id que existe nele:

```bash
export MOBILE_APP_PATH="/caminho/para/app-de-teste.apk"
export MOBILE_HOME_ACCESSIBILITY_ID="home-title"
mvn test
```

No PowerShell:

```powershell
$env:MOBILE_APP_PATH = "C:\caminho\para\app-de-teste.apk"
$env:MOBILE_HOME_ACCESSIBILITY_ID = "home-title"
mvn test
```

Sem `MOBILE_APP_PATH`, o teste fica ignorado pelo JUnit, permitindo validar a compilação sem iniciar device. O exemplo não inclui APK, credenciais ou acesso a ambiente externo.

## Próximos passos

1. Troque o accessibility id pelo identificador semântico do app autorizado.
2. Adicione esperas explícitas para estados assíncronos.
3. Crie Page Objects pequenos quando houver repetição real.
4. Salve screenshot e page source em falha, removendo dados sensíveis.
5. Só então planeje browser mobile, WebViews, iOS ou device farm.

O código usa o endereço padrão do Appium 3 (`http://127.0.0.1:4723`). Configure `APPIUM_SERVER_URL` se seu servidor usa outro endereço.
