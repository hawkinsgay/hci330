from flask import Response, request
from flask_restful import Resource
from mongoengine import DoesNotExist, Q
import models
import json

class CommentListEndpoint(Resource):
    
    def get(self):
        post_id = request.args.get('post_id')
        if post_id:
            #List all of the comments that are currently in my database:
            data = models.Comment.objects.filter(post=post_id)
        else:
            data = models.Comment.objects
        data = data.to_json()
        return Response(data, mimetype="application/json", status=200)

    def post(self):
        body = request.get_json()
        # would normally do some validation here...
        # INPUTS for the body of the json post:
        # comment
        # author
        # post = the id of the post you are commenting on 
        print(body)
        comment = models.Comment(**body).save()
        serialized_data = {
            'id': str(comment.id),
            'message': 'Comment {0} successfully created.'.format(comment.id)
        }
        return Response(json.dumps(serialized_data), mimetype="application/json", status=201)
        
class CommentDetailEndpoint(Resource):
    def put(self, id):
        # TODO: implement PUT endpoint
        # body = request.get_json()
        com = models.Comment.objects.get(id=id)
        request_data = request.get_json()
        com.comment = request_data.get('comment')
        com.author = request_data.get('author')
        com.post = request_data.get('post')
        com.save()
        print(post.to_json())
        return Response(com.to_json(), mimetype="application/json", status=200)
    
    def delete(self, id):
        # this has been implemented 
        com = models.Comment.objects.get(id=id)
        com.delete()
        serialized_data = {
            'message': 'Comment {0} successfully deleted.'.format(id)
        }
        return Response(json.dumps(serialized_data), mimetype="application/json", status=200)

    def get(self, id):
        # TODO: implement GET endpoint
        com = models.Comment.objects.get(id=id)
        return Response(com.to_json(), mimetype="application/json", status=200)

def initialize_routes(api):
    api.add_resource(CommentListEndpoint, '/api/comments', '/api/comments/')
    api.add_resource(CommentDetailEndpoint, '/api/comments/<id>', '/api/comments/<id>/')
    # api.add_resource(CommentListEndpoint, '/api/posts/<post_id>/comments', '/api/posts/<post_id>/comments/')
    # api.add_resource(CommentDetailEndpoint, '/api/posts/<post_id>/comments/<id>', '/api/posts/<post_id>/comments/<id>/')