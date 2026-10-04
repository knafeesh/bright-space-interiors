import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { username, password } = await request.json();

    const validUsername = "mohdmushir12";
    const validPassword = "mushir@2005";

    if (username === validUsername && password === validPassword) {
      return NextResponse.json({
        success: true,
        user: {
          username: "mohdmushir12",
          name: "Mohd Mushir",
          role: "Super Admin",
        },
      });
    }

    return NextResponse.json(
      { success: false, error: "Invalid username or password" },
      { status: 401 }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Authentication failed" },
      { status: 500 }
    );
  }
}
