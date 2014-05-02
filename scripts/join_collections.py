# coding: utf-8

import soundcloud, pymongo, collections, time
#import matplotlib.pyplot as plt
#import numpy as np

conn = pymongo.Connection()
db = conn.soundcloud

users = list(db.users.find())

merged = []

for u in users:
	f = db.follows.find_one({"id": u['id']})
	g = db.usersgenre.find_one({"id": u['id']})
	m = dict(u.items() + f.items() + g.items())
	#print m
	db.data.save(m)

N = db.data.count()

print str(N) + ' records merged and saved to mongodb.'

conn.disconnect()