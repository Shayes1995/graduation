import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: "klistra in vår api nyckel",
});

const completion = openai.chat.completions.create({
  model: "gpt-4o-mini",
  store: true,
  messages: [
    {"role": "user", "content": "kan du med inte mer än 20 ord ge mig 10 viktiga personliga egenskaper och 10 av de viktigaste tekniska verktygen för att lyckas i rollen som programerare"},
  ],
});

completion.then((result) => console.log(result.choices[0].message));