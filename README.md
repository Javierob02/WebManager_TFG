# Interfaz Web para Gestión de Base de Datos de F1 Fan

Esta interfaz web está diseñada para manejar la base de datos de la aplicación "[F1 Fan](https://github.com/Javierob02/F1Fan_APP)". La interfaz soporta dos tipos de bases de datos:

- **Base de datos relacional MySQL**
- **Firebase Storage**

Utiliza APIs para conectarse tanto a la base de datos MySQL como a los servicios de Firebase Storage y Authentication.

## Uso Básico

Para utilizar esta interfaz web, simplemente clona el repositorio y ábrelo en tu editor de código preferido, como por ejemplo "Webstorm".

## Pruebas de Interfaz con Cypress

Esta interfaz incluye pruebas de interfaz utilizando Cypress. Para ejecutar estas pruebas, sigue los siguientes pasos:

1. Instala los módulos necesarios de Cypress ejecutando el siguiente comando en la raíz del proyecto:
```sh
npm install
```

2. Asegúrate de proporcionar las credenciales correctas en el comando "**login**" dentro del archivo '**cypress/support/commands.js**' para poder ejecutar las pruebas correctamente:
```js
Cypress.Commands.add('login', (no_visit) => {
    cy.visit('/Login/login.html');
    cy.get('#username').click({force:true}).clear({force:true}).type('<username>', {force:true});   //Cambiar usuario
    cy.get('#password').click({force:true}).clear({force:true}).type('<password>', {force:true});   //Cambiar contraseña
    cy.get('#LoginBTN').click({force:true});
})
```

3. Abre Cypress desde el directorio raíz del proyecto usando el siguiente comando:
```sh
npx cypress open
```
> ⚠️ **Advertencia:** A veces para macOS es necesario usar 'sudo' en este comando.
