(async () => {
  console.log(
    await (
      await fetch("http://localhost:5000/aadhaar?aadhaar_number=2345-6789-0123")
    ).json()
  );
})();
