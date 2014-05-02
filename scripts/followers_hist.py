# coding: utf-8

import pymongo
import matplotlib.pyplot as plt
import numpy as np

conn = pymongo.Connection()
db = conn.soundcloud

allusers = list(db.users.find())

x = [user['followers_count'] for user in allusers]

hist, bins = np.histogram(x, bins=100)
width = 0.7 * (bins[1] - bins[0])
center = (bins[:-1] + bins[1:]) / 2
plt.bar(center, hist, align='center', width=width)
plt.show()