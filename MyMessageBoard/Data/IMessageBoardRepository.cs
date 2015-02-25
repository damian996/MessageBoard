using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MyMessageBoard.Data
{
    /*
     * We use repository interfece mainly to make testing easier. For test we can mockup a fake repository
     * and use it instead of real repository and real database. For this reason we need interface.
     */
    public interface IMessageBoardRepository
    {        
        IQueryable<Topic> GetTopics();
        IQueryable<Topic> GetTopicsIncludingReplies();
        IQueryable<Reply> GetRepliesByTopic(int topicId);

        bool Save();

        bool AddTopic(Topic newTopic);
        bool AddReply(Reply newReply);
    }
}
