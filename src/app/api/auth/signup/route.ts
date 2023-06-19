import { NextResponse } from "next/server";
import User from "@/models/user";
import bcrypt from "bcryptjs";
import { connectDB } from "@/libs/mongodb";

export async function POST(request: Request) {
  const { name, email, password } = await request.json();

  console.log("name", name, "email", email, "password", password);
  if (!password || password.length < 6) {
    return NextResponse.json(
      { message: "Password must be at least 6 characters long" },
      { status: 400 }
    );
  }

  try {
    connectDB();
    const userFound = await User.findOne({ email });

    if (userFound) {
      return NextResponse.json(
        { message: "Email already exists" },
        { status: 409 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const user = new User({ name, email, password: hashedPassword });

    const savedUser = await user.save();
    console.log(savedUser);

    return NextResponse.json(savedUser, { status: 201 });
  } catch (error) {
    console.log(error);
    if (error instanceof Error)
      return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
