import { getServerSession } from "next-auth";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { authOptions } from "../../auth/[...nextauth]/options";
import {
  createSuccessResponse,
  createErrorResponse,
} from "@/types/responseUtils";


export async function DELETE(request:Request,{params}: {params:{messageId:string}} ) {
    await dbConnect();
      //const {messageid}= params  or nextLine
      const messageId= params.messageId;


    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return createErrorResponse("Not Authenticated ", 401);
    }
    const current_User = session.user;


    try {
       const response = await UserModel.updateOne({_id:current_User._id},{$pull:{messages:{_id:messageId}}})
       console.log("this is line 26 from delete message api",response)
        if( response.modifiedCount ==0 ){
             return createErrorResponse("Message not found, or already deleted",404)   
        }
          
        return createSuccessResponse("Message was deleted!",200)
    } catch (error) {
       console.log('There was an error at deleting message api', error);
       return createErrorResponse("Something went wrong while deleting message",500)
    }
  
  
}