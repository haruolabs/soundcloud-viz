# coding: utf-8

import soundcloud, pymongo, collections, time
#import matplotlib.pyplot as plt
#import numpy as np

name = 'haruo666' #USER_NAME_TO_START_FROM
client_id = 'bdda2ef6288ce297f7e873a987e7dc02' #YOUR_CLIENT_ID_HERE

client = soundcloud.Client(client_id=client_id)

conn = pymongo.Connection()
db = conn.soundcloud3

allusers = list(db.users.find())

genres = []
count = 0
N = len(allusers)

for user in allusers:
	tracks = client.get('/users/' + str(user['id']) + '/tracks')
	genre_list = filter(None, [t.genre for t in tracks]) #Remove blanks
	genres += genre_list
	#print genre_list
	if genre_list:
		common_genre = max(set(genre_list), key=genre_list.count) #Find the most common genre
	else:
		common_genre = 'Unknown'

	db.usersgenre.save({'id': user['id'], 'username': user['username'], 'genres': genre_list})

	count += 1
	print str(count) + '/' + str(N) + ' - User: ' + user['username'] + ' - Genre: ' + common_genre
	time.sleep(0.8)
	#if count > 100: break

#print genres
counter = collections.Counter(genres)
print counter.most_common()

conn.disconnect()