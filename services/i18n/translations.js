const resources = Object.freeze({
  fi: {
    translation: {
      account: {
        login: 'Kirjaudu sisään',
        logout: 'Kirjaudu ulos',
        register: 'Rekisteröidy',
        alreadyAccount: 'Onko sinulla jo tili?',
      },
      avatar: {
        choose: 'Valitse Avatar',
        delete: 'Poista Avatar',
      },
      common: {
        ok: 'Ok',
      },
      error: {
        notification: 'Ilmoitus',
      },
      form: {
        login: {
          usernameLabel: 'Käyttäjänimi',
          passwordLabel: 'Salasana',
          loginButton: 'Kirjaudu',
          noAccount: 'Eikö sinulla ole vielä tiliä?',
          usernameMissing: 'Syötä käyttäjänimi',
          passwordMissing: 'Syötä salasana',
          invalidCredentials: 'Väärä käyttäjätunnus tai salasana',
        },
        register: {
          error:
            'Virhe rekisteröityessä. Ole hyvä, ja yritä myöhemmin uudelleen.',

          fullNameLabel: 'Koko nimi',

          usernameLabel: 'Käyttäjänimi',
          usernameRequired: 'Syötä käyttäjänimi',
          usernameTooShort:
            'Käyttäjänimen tulee olla vähintään viisi merkkiä pitkä',
          usernameTaken: 'Tämä käyttäjätunnus on jo käytössä',

          emailLabel: 'Sähköpostiosoite',
          emailRequired: 'Syötä sähköpostiosoite',
          emailInvalid: 'Virheellinen sähköpostiosoite',

          passwordLabel: 'Salasana',
          passwordRequired: 'Syötä salasana',
          passwordTooShort:
            'Salasanan tulee olla vähintään viisi merkkiä pitkä',
          passwordsNotMatching: 'Salasanat eivät täsmää',

          verifyPasswordLabel: 'Vahvista salasana',

          success: 'Rekisteröityminen onnistui. Ole hyvä, ja kirjaudu sisään.',
          submit: 'Rekisteröidy',
        },
      },
      navigation: {
        bottom: {
          profile: 'Profiili',
          search: 'Haku',
          recipes: 'Reseptit',
          favorites: 'Suosikit',
        },
      },
      profile: {
        email: 'Sähköpostiosoite',
        name: 'Nimi',
        username: 'Käyttäjänimi',
        publications: 'Julkaisuja',
        favorites: 'Suosikkeja',
        likes: 'Tykkäyksiä',
      },
    },
  },
})

export default resources
