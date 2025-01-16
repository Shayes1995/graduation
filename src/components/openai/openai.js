import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: "klistra in vår api nyckel",
});

/* const completion = openai.chat.completions.create({
  model: "gpt-4o-mini",
  store: true,
  messages: [
    {"role": "user", "content": "kan du med inte mer än 20 ord ge mig 10 viktiga personliga egenskaper och 10 av de viktigaste tekniska verktygen för att lyckas i rollen som programerare"},
  ],
}); */

/* completion.then((result) => console.log(result.choices[0].message)); */

const response = await openai.chat.completions.create({
  model: "gpt-4o-mini",
  messages: [
    {
      role: "user",
      content: [
        { type: "text", text: "What are in these images? Is there any difference between them?" },
        {
          type: "image_url",
          image_url: {
            "url": "https://upload.wikimedia.org/wikipedia/commons/thumb/d/dd/Gfp-wisconsin-madison-the-nature-boardwalk.jpg/2560px-Gfp-wisconsin-madison-the-nature-boardwalk.jpg",
          },
        },
        {
          type: "image_url",
          image_url: {
            "url": "https://upload.wikimedia.org/wikipedia/commons/thumb/d/dd/Gfp-wisconsin-madison-the-nature-boardwalk.jpg/2560px-Gfp-wisconsin-madison-the-nature-boardwalk.jpg",
          },
        }
      ],
    },
  ],
});
console.log(response.choices[0]);