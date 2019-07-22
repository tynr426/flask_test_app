from tornado.wsgi import WSGIContainer
from tornado.httpserver import HTTPServer
from tornado.ioloop import IOLoop
from tornado.web import Application, FallbackHandler, RequestHandler
from app.create import app

wsgi = WSGIContainer(app)

class AaaHandler(RequestHandler):

    def set_default_headers(self):
        print("setting headers!!!")
        self.set_header("Access-Control-Allow-Origin", "*")
        self.set_header("Access-Control-Allow-Headers",
                        "Content-Type,Content-Length, Authorization, Accept,X-Requested-With")
        self.set_header('Access-Control-Allow-Methods', 'POST, GET, OPTIONS')

    def get(self, *args, **kwargs):
        print("get sfdf")

        self.write("tje")

    def post(self, *args, **kwargs):
        # ret = self.get("k1")
        print("post sdssddsfdf")

        self.write("tje")

    def options(self, *args, **kwargs):
        pass
    #    print("optioins request")

    #   self.write("sdfsfdaf")


settings = {

    #'template_path': 'views',
    #'static_path': 'static',
    #'static_url_prefix': '/static/',
}

application = Application([
    (r"/test", AaaHandler),
    (r".*", FallbackHandler, dict(fallback=wsgi)),
], **settings)

http_server = HTTPServer(wsgi)

if __name__ == "__main__":
  http_server.listen(8008)
  IOLoop.instance().start()

