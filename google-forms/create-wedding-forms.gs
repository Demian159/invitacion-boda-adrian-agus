/**
 * Creates the two Google Forms needed for the wedding invitation.
 *
 * How to use:
 * 1. Open https://script.google.com/.
 * 2. Create a new Apps Script project.
 * 3. Paste this file into Code.gs.
 * 4. Run createWeddingForms().
 * 5. Authorize the script when Google asks.
 * 6. Open View > Logs and copy the generated public URLs.
 */

function createWeddingForms() {
  const rsvpForm = createRsvpForm_();
  const musicForm = createMusicForm_();

  const message = [
    'FORMULARIOS CREADOS',
    '',
    'Confirmacion de asistencia',
    'Publico: ' + rsvpForm.getPublishedUrl(),
    'Editar:  ' + rsvpForm.getEditUrl(),
    '',
    'Sugerencia de canciones',
    'Publico: ' + musicForm.getPublishedUrl(),
    'Editar:  ' + musicForm.getEditUrl(),
  ].join('\n');

  Logger.log(message);
  console.log(message);
}

function createRsvpForm_() {
  const form = FormApp.create('Adrian y Agus - Confirmacion de asistencia')
    .setTitle('¿VENIS?')
    .setDescription(
      'Esperamos que puedas acompanarnos en este momento tan especial.\n' +
        'Si fuiste invitado/a con acompanante, completa un formulario por persona.\n' +
        'Una vez que lo completes... ¡volve a la invitacion para no perderte nada!'
    )
    .setCollectEmail(false)
    .setLimitOneResponsePerUser(false)
    .setAllowResponseEdits(false)
    .setConfirmationMessage(
      '¡Gracias por responder! Volve a la invitacion para seguir viendo todos los detalles.'
    );

  addText_({
    form,
    title: 'NOMBRE Y APELLIDO',
    required: true,
  });

  addMultipleChoice_({
    form,
    title: '¿VENIS A NUESTRO CASAMIENTO?',
    choices: ['SI, OBVIO!', 'NO VOY A PODER ASISTIR'],
    required: true,
  });

  addMultipleChoice_({
    form,
    title: 'RESTRICCION ALIMENTICIA',
    helpText:
      'Selecciona si tenes alguna restriccion alimentaria. Haremos lo posible para sumar al menu alguna opcion apta para vos.',
    choices: ['NO TENGO RESTRICCIONES', 'COMO SIN TACC', 'SOY VEGANO/A', 'SOY VEGETARIANO/A'],
    hasOther: true,
    required: false,
  });

  addCheckbox_({
    form,
    title: 'BEBIDAS',
    helpText:
      'Para nosotros es super importante que te sientas a gusto y por eso queremos saber que preferis tomar en nuestra boda.',
    choices: [
      'NO CONSUMO ALCOHOL',
      'FERNET',
      'GIN TONIC',
      'CAMPARI',
      'VERMUT',
      'VINO',
      'CERVEZA',
    ],
    hasOther: true,
    required: false,
  });

  addText_({
    form,
    title: 'CONTACTO',
    helpText:
      'Dejanos un numero de WhatsApp donde podamos encontrarte si necesitamos consultarte o informarte algo del evento.',
    required: true,
  });

  addParagraph_({
    form,
    title: 'MENSAJE PARA LOS NOVIOS',
    helpText: 'Si necesitas hacernos alguna consulta o queres dejarnos algun mensaje, este es el lugar.',
    required: false,
  });

  return form;
}

function createMusicForm_() {
  const form = FormApp.create('Adrian y Agus - Sugerencia de canciones')
    .setTitle('¡AYUDANOS A QUE SEA UN FIESTON!')
    .setDescription(
      '¿Que canciones no pueden faltar en nuestra fiesta?\n' +
        'Sugerí tus temas preferidos y volve a la invitacion para seguir viendo todos los detalles.'
    )
    .setCollectEmail(false)
    .setLimitOneResponsePerUser(false)
    .setAllowResponseEdits(false)
    .setConfirmationMessage(
      '¡Gracias por sumar musica! Volve a la invitacion para seguir viendo todos los detalles.'
    );

  addText_({
    form,
    title: 'TEMA 1',
    helpText: 'Cancion y artista.',
    required: true,
  });

  addText_({
    form,
    title: 'TEMA 2',
    helpText: 'Cancion y artista.',
    required: false,
  });

  addText_({
    form,
    title: 'TEMA 3',
    helpText: 'Cancion y artista.',
    required: false,
  });

  return form;
}

function addText_({ form, title, helpText, required }) {
  const item = form.addTextItem().setTitle(title).setRequired(Boolean(required));

  if (helpText) {
    item.setHelpText(helpText);
  }

  return item;
}

function addParagraph_({ form, title, helpText, required }) {
  const item = form.addParagraphTextItem().setTitle(title).setRequired(Boolean(required));

  if (helpText) {
    item.setHelpText(helpText);
  }

  return item;
}

function addMultipleChoice_({ form, title, helpText, choices, hasOther, required }) {
  const item = form
    .addMultipleChoiceItem()
    .setTitle(title)
    .setChoiceValues(choices)
    .setRequired(Boolean(required));

  if (helpText) {
    item.setHelpText(helpText);
  }

  if (hasOther) {
    item.showOtherOption(true);
  }

  return item;
}

function addCheckbox_({ form, title, helpText, choices, hasOther, required }) {
  const item = form
    .addCheckboxItem()
    .setTitle(title)
    .setChoiceValues(choices)
    .setRequired(Boolean(required));

  if (helpText) {
    item.setHelpText(helpText);
  }

  if (hasOther) {
    item.showOtherOption(true);
  }

  return item;
}
