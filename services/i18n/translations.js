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
        cancel: 'Peruuta',
        dialog: {
          notification: 'Ilmoitus',
          uploadingData: 'Lähetetään tietoja palvelimelle...',
          uploadReady: 'Tietojen lähetys palvelimelle onnistui.',
        },
        ok: 'Ok',
      },
      diets: {
        glutenFree: 'Gluteeniton',
        lactoseFree: 'Laktoositon',
      },
      error: {
        notification: 'Ilmoitus',
      },
      recipe: {
        removeSearch: 'Poista hakutulokset',
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
        newRecipe: {
          addMedia: 'Kuvat ja videot',
          addMediaButton: 'Valitse mediaa',
          addRow: 'Lisää rivi',
          amountMissing: 'Syötä annosmäärä',
          amountNumbersOnly: 'Ainoastaan numerot ovat sallittu ainemäärässä',
          chooseCoverPhoto: 'Valitse kuva valmiista annoksesta',
          coverPhotoMissing: 'Kuva valmiista annoksesta puutuu',
          dietsLabel: 'Erityisruokavaliot',
          doseAmountAsNumber: 'Annosmäärässä on sallittu ainoastaan numerot',
          doseAmountLabel: 'Annosmäärä',
          doseAmountMissing: 'Syötä annosmäärä',
          instruction: 'Valmistusohjeet',
          instructionRequired: 'Syötä ohje',
          missingRecipeName: 'Reseptin nimi puuttuu',
          preparationTimeAsNumber:
            'Valmistusajassa on sallituu ainoastaan numerot',
          preparationTimeLabel: 'Valmistusaika (min)',
          preparationTimeMissing: 'Syötä valmistusaika',
          recipeNameLabel: 'Reseptin nimi',
          recipeNameMissing: 'Syötä reseptin nimi',
          substanceMissing: 'Ainesosa puuttuu',
          substances: {
            amount: 'Määrä',
            unit: 'Yksikkö',
            substance: 'Ainesosa',
          },
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
        search: {
          recipeName: 'Reseptin nimi',
          diet: 'Ruokavalio (voit valita useamman)',
          ingredients: 'Ainekset (voit valita useamman)',
          preparationTime: 'Valmistusaika (min)',
          searchButton: 'Hae',
          add: 'Lisää ainesosa',
        },
      },
      navigation: {
        bottom: {
          profile: 'Profiili',
          search: 'Haku',
          recipes: 'Reseptit',
          favorites: 'Suosikit',
          login: 'Kirjaudu',
        },
        recipesStack: {
          addRecipe: 'Lisää resepti',
          recipes: 'Reseptit',
          recipeView: 'Reseptin tarkastelu',
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
      progress: {
        finishButton: 'Lisää resepti',
        newRecipe: {
          basicDetails: 'Perustiedot',
          instructions: 'Ohjeet',
          substances: 'Ainekset',
        },
        nextButton: 'Seuraava',
        previousButton: 'Edellinen',
      },
      recipe: {
        deleteConfirmation: 'Haluatko varmasti poistaa tämän reseptin?',
      },
      singleImage: {
        choosePhoto: 'Valitse kuva',
        takePhoto: 'Ota kuva',
      },
      tabs: {
        recipe: {
          basicDetails: 'Perustiedot',
          instructions: 'Ohjeet',
          substances: 'Ainekset',
        },
        recipes: {
          all: 'Kaikki',
          own: 'Omat',
        },
      },
    },
  },
})

export default resources
