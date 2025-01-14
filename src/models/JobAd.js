export class JobAd {
    constructor
    (title="", introDesc="", location="", category="", jobform="", startDate="", 
        typeOfAssignment="", description="", detailedDesc="", keyWords="", offerings="", 
        requirements="", personalTraits="") {
      this.title = title;
      this.introDesc = introDesc;
      this.location = location;
      this.category = category;
      this.jobform = jobform;
      this.startDate = startDate;
      this.typeOfAssignment = typeOfAssignment;
      this.description = description;
      this.detailedDesc = detailedDesc;
      this.keyWords = keyWords;
      this.offerings = offerings;
      this.requirements = requirements;
      this.personalTraits = personalTraits;
    }
}

