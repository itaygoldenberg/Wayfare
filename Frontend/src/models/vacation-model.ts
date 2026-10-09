// A vacation; likesCount and isLiked (1 or 0) come from the server, image only when uploading.
export class VacationModel {
  public vacationId: number;
  public destination: string;
  public description: string;
  public startDate: string;
  public endDate: string;
  public price: number;
  public imageName: string;
  public likesCount: number;
  public isLiked: number;
  public image: File;
}
