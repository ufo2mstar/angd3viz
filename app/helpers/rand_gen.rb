require 'require_all'
require_all 'rand_utils/*.rb'

RandSeed.germinate 1234

clients = 5
accounts = 10
positions = 7
facilities = 3
obligations = 10

module RandAM
  extend self
  include MatchMaker

  def create name, num
    n_dig = 10
    num = n_dig
    num.times.map { "#{name} - #{rand(num).to_s.rjust(n_dig, '0')}" }
  end

  def combine src, dest
    res = []
    pair = serial_pair src, dest
    num = 10
    pair.each{ |link| res << "#{link[0]},#{link[1]},10"}
    puts res
  end
end


c = RandAM.create "ECI", clients
a = RandAM.create "ACC", accounts
p = RandAM.create "pos", positions
f = RandAM.create "Fac", facilities
o = RandAM.create "oblg", obligations

RandAM.combine c, a
RandAM.combine a, p
RandAM.combine p, f
RandAM.combine f, o

