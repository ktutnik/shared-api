import { GenericController } from "@plumier/typeorm";
import { Application } from "../../backend/application/application-entity";

export class ApplicationController extends GenericController(Application, c => {
    c.methods("Delete", "GetMany", "GetOne", "Patch", "Put").authorize("Admin")
    c.post().ignore()
    c.setPath("admin/applications/:id")
}) {}