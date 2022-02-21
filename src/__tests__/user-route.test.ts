import supertest from "supertest";
import app from "../../server";
test("POST /signup", async () => {
  //   const post = await Post.create({ title: "Post 1", content: "Lorem ipsum" });

  const res = await supertest(app).post("/signup").send({
    firstName: "Priya",
    lastName: "Puja",
    dob: "29Dec,1994",
    mobile: "7897987987",
    email: "test@gmail.com",
    password: "123344",
    token: {},
  });

  expect(res.statusCode).toEqual(201);
  // .expect(200)
  // .then((response) => {
  //   // Check type and length
  //   expect(Array.isArray(response.body)).toBeTruthy();
  //   expect(response.body.length).toEqual(1);

  //   // Check data
  //   expect(response.body[0]._id).toBe(post.id);
  //   expect(response.body[0].title).toBe(post.title);
  //   expect(response.body[0].content).toBe(post.content);
  // });
});
