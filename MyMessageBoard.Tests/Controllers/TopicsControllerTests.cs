using System;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using MyMessageBoard.Controllers;
using MessageBoard.Tests.Fakes;
using System.Linq;
using MyMessageBoard.Data;
using System.Net;
using System.Web.Http;
using System.Net.Http;
using System.Web.Http.Routing;
using System.Web.Http.Controllers;
using System.Web.Http.Hosting;
using Newtonsoft.Json;

namespace MyMessageBoard.Tests.Controllers
{
    [TestClass]
    public class TopicsControllerTests
    {
        private TopicsController _ctrl;

        [TestInitialize]
        public void Init()
        {
            _ctrl = new TopicsController(new FakeMessageBoardRepository());
        }
        [TestMethod]
        public void TopicsController_Get()
        {          

            var results = _ctrl.Get(true);

            Assert.IsNotNull(results);
            Assert.IsTrue(results.Count() > 0);
            Assert.IsNotNull(results.First());
            Assert.IsNotNull(results.First().Title);
        }

        [TestMethod]
        public void TopicsController_Post()
        {
            // Testing POST is harder than it should be but we need to do some work:

            var config = new HttpConfiguration();
            var request = new HttpRequestMessage(HttpMethod.Post, "http://localhost/api/v1/topics");
            var route = config.Routes.MapHttpRoute("DefaultApi", "api/{controller}/{id}");
            var routeData = new HttpRouteData(route, new HttpRouteValueDictionary { { "controller", "topics" } });

            _ctrl.ControllerContext = new HttpControllerContext(config, routeData, request);
            _ctrl.Request = request;
            _ctrl.Request.Properties[HttpPropertyKeys.HttpConfigurationKey] = config;

            var newTopic = new Topic()
            {
                Title = "TestTopic",
                Body = "This is a test of a topic"
            };

           var response = _ctrl.Post(newTopic);

           Assert.AreEqual(HttpStatusCode.Created, response.StatusCode);

           var json = response.Content.ReadAsStringAsync().Result;
           var topic = JsonConvert.DeserializeObject<Topic>(json);

           Assert.IsNotNull(topic);
           Assert.IsTrue(topic.Id > 0);
           Assert.IsTrue(topic.Created > DateTime.MinValue);
        }
    }
}
