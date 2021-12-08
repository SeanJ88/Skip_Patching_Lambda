'use strict';

const aws = require('aws-sdk')
aws.config.update({ region: process.env.REGION });
const ec2 = new aws.EC2()
const tags = process.env.TAGS

module.exports.skip = async (event, context) => {
  try {

    const value = event['state']

    console.info('Setting Skip Patching to: %s', value)

    var roles = tags.split(',')

    for (const tag of roles) {

      const add_tag = `[{"Key": "Skip_Patching", "Value": ${value}}]`

      var params = {
        Filters: [
          {
            'Name': 'tag:Role',
            'Values': [
              tag
            ]
          },
        ]
      };

      var instances = await ec2.describeInstances(params).promise();

      for (const instance of instances['Reservations']) {

        var instance_id = instance['Instances'][0]['InstanceId']

        var params = { Resources: [instance_id], Tags: add_tag }

        await ec2.createTags(params).promise();

        console.info('Created Tag on Instance ID: %s with Role: %s with Tag: $s', instance_id, tag, add_tag)
      }
    }

    return console.info('All Required Instances Has set Skip Patching To: %s', value)

  } catch (e) {
    return console.error('Failure Creating/Updating Skip Patching Tags: %s', e)
  }
};