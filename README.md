# Jwt Authenticate

## Descrizione

L'applicativo si occupa di gestire le funzionalità di autenticazione/autorizzazione attraverso JWT.
Si tratta di una REST API su Nodejs, che incarica da un lato di creare i token per l'accesso (access token) e per la rigenerazione del token scaduto (refresh token) per poi restituirli al client, dall'altro di analizzare le richieste dal client per l'autenticazione e l'utilizzo delle risorse.

## Funzionamento

(PUT) /auth/signup
L'utente richiede la creazione dell'account con nome, email, password. Il server crea l'account nel database.

(POST) /auth/login
L'utente richiede l'autenticazione. Il server controlla le credenziali, se corrette, restituisce un JSON con userId, access token e refresh token, che servirà per la rigenerazione del token in caso sia scaduto.

(POST) /auth/refresh-token
Il cliente richiede la rigenerazione dell'accesso token, tramite il refresh token. Il server segna come revocato il refresh token tramite cui si è fatto la richiesta, e genera due nuovi token (access e refresh) restituendoli al client per permettere la continuazione dell'accesso.

(POST) /auth/revoke-token
Il cliente richiede la revoca del token, che può essere necessaria se si vuole neutralizzare l'accesso di determinati utenti, per esempio per un elminazione dello stesso o per cambio permessi.

## Dipendenze

Npm:
```jshelllanguage
npm install
```

## Installing
Clonare applicativo
```git
git clone git@git.snaitech.net/common/betbuddy-producer
```

## Configurazione
Generare file direttiva.inc per configurare l'ambiente
```js

```