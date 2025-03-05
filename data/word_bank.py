
import random

class WordBank:
  def __init__(self):
    # TODO Change the clusters depending on the difficulty
    self.letter_clusters = [
    "st", "tr", "ch", "ph", "sh", "th", "gr", "cr", "dr", "fr",
    "bl", "br", "cl", "pl", "pr", "qu", "sc", "sl", "sp", "sw",
    "wr", "wh", "sn", "fl", "sk"
    ]
    self.used_cluster = []
    self.current_cluster = ''

  '''
    This function gets a letter cluster for the user to create words with
  '''
  def get_cluster(self):
    if self.letter_clusters:
      for word in range(len(self.letter_clusters)):
        self.current_cluster = random.choice(self.letter_clusters)
        self.used_cluster.append(self.current_cluster)
        return self.current_cluster
      print('No letter clusters remaining')
      return False
