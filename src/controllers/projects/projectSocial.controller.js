const projectSocialController = {

    async getAllLikes (req, res) {},
    async getLikesCount (req, res) {},
    async amILike (req, res) {},
    async addLike (req, res) {},
    async removeLike (req, res) {},

    async getAllComments(req, res) {},
    async getCommentByIndex(req, res) {},
    async getCommentsCount(req, res) {},
    async addComment(req, res) {},
    async removeComment(req, res) {},
    async getMyComments(req, res) {},

    async getAllRatings(req, res) {},
    async getRatingAverage(req, res) {},
    async getMyRating(req, res) {},
    async rateProject(req, res) {},
    async updateRating(req, res) {},
    async deleteRating(req, res) {},
}

module.exports = projectSocialController;