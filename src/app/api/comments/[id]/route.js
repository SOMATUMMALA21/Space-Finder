import { NextResponse } from "next/server";
import prisma from "@/lib/db";
import { checkLoggedIn } from "@/lib/auth";

export async function PUT(request, { params }) {
  const loggedInData = await checkLoggedIn();
  const id = parseInt(params.id);
  if (loggedInData.loggedIn && id) {
    const { text, votes } = await request.json();
    console.log("finding", {id, text, ownerId: loggedInData.user.id});
    try {
      const cmnt = await prisma.comment.update({
        where: {
          id, ownerId: loggedInData.user.id
        }, 
        data: {
          text: text,
          votes: votes
        }
      });
      return NextResponse.json(cmnt);
    } catch {
      return NextResponse.json({error: 'comment not found'}, {status: 401});
    }
  }
  return NextResponse.json({error: 'not signed in'}, {status: 403});
}

export async function DELETE(request, { params }) {
  const loggedInData = await checkLoggedIn();
  const id = parseInt(params.id);
  if (loggedInData.loggedIn && id) {
    const cmnt = await prisma.comment.delete({
      where: {
        id,
        ownerId: loggedInData.user?.id
      }
    });
    return NextResponse.json({ deleted: cmnt });
  }
  return NextResponse.json({error: 'not signed in'}, {status: 403});
}