export const validateRoomSettings = settings => {
  const errors = {};

  if (!settings.name) {
    errors.name = 'Room name is required.';
  }

  if (!settings.maxScore) {
    errors.maxScore = 'Max score cannot be empty.';
  } else if (parseInt(settings.maxScore <= 0)) {
    errors.maxScore = 'Max score cannot be equal or less than 0.';
  }

  return errors;
};
