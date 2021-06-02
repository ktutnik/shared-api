import { GenericController } from "@plumier/mongoose";
import { User } from "../../backend/user/user-entity";



export class UserController extends GenericController(User, c => {
    c.setPath("admin/users/:id")
    c.methods("Delete", "GetMany", "GetOne", "Patch", "Put").authorize("Admin")
    c.post().ignore()
}){}