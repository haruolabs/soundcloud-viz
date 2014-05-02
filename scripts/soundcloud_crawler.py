import soundcloud, pymongo, time

name = USER_NAME_TO_START_FROM
client_id = YOUR_CLIENT_ID_HERE

client = soundcloud.Client(client_id=client_id)

popular_users = []
popular_thres = 10000

me = client.get('/users/' + name)
#followers = client.get('/users/' + name + '/followers')
followings = client.get('/users/' + name + '/followings')

followings_list = [u.id for u in followings if u.followers_count >= popular_thres]
edge = {'id': me.id, 'followings': followings_list}

print 'Starting sampling from user: ' + me.username
print [u.username for u in followings]

#Connect to MongoDB
conn = pymongo.Connection()
db = conn.soundcloud3
db.users.save(me.obj)
db.follows.save(edge)

level = 1
sampled = [followings_list]

next = []
while level <= 12:
	count = 0
	for uid in followings_list:
		if uid not in sampled:
			count += 1
			print 'Sampling level:' + str(level) + ' , ' + str(count) + '/' + str(len(followings_list)) + ', Next queued: ' + str(len(next))
			sampled.append(uid)
			user = client.get('/users/' + str(uid))
			if user.followers_count > popular_thres:
				print 'Popular: ' + user.username + ' Followers: ' + str(user.followers_count)
				popular_users.append(user.username)
			#u_followers = client.get('/users/' + str(uid) + '/followers')
			time.sleep(1)
			followings = client.get('/users/' + str(uid) + '/followings')

			for i in [u.id for u in followings if u.followers_count >= popular_thres and u.id not in sampled]:
				#if i not in sampled:
				next.append(i)

			edge = {'id': uid, 'followings': [u.id for u in followings if u.followers_count >= popular_thres]}

			db.users.save(user.obj)
			db.follows.save(edge)
			time.sleep(1)

	followings_list = next
	next = []
	level += 1

print popular_users

conn.disconnect()