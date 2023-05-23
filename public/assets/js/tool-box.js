// These are functions not coded by me

// [Start of External Code]

function formToJSON(formData) {
  // https://stackoverflow.com/a/62010324
  // Code by OpSocket
  
  return Object.fromEntries(
    Array.from(formData.keys()).map(key => [
      key, formData.getAll(key).length > 1 ? 
        formData.getAll(key) : formData.get(key)
    ])
  );
}

// [End of External Code]

export { formToJSON };